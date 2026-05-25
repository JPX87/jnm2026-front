export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const VALID_CONTESTS = ['video', 'rugby'];

type ActiveGroup = { name: string };

function getExcludedCities(userMiage: string | null): string[] {
    if (!userMiage) return [];
    return [userMiage];
}

type RawVote = { first: string; second: string; third: string; isJury: boolean };

function computeResults(votes: RawVote[], allGroups: ActiveGroup[]) {
    const points = new Map<string, { p: number; j: number }>();
    for (const g of allGroups) points.set(g.name, { p: 0, j: 0 });

    for (const vote of votes) {
        const add = (city: string, pts: number) => {
            const cur = points.get(city) ?? { p: 0, j: 0 };
            if (vote.isJury) points.set(city, { ...cur, j: cur.j + pts });
            else points.set(city, { ...cur, p: cur.p + pts });
        };
        add(vote.first, 3);
        add(vote.second, 2);
        add(vote.third, 1);
    }

    const totalP = [...points.values()].reduce((s, c) => s + c.p, 0);
    const totalJ = [...points.values()].reduce((s, c) => s + c.j, 0);

    return [...points.entries()].map(([city, pts]) => ({
        city,
        participantScore: totalP > 0 ? (pts.p / totalP) * 50 : 0,
        juryScore: totalJ > 0 ? (pts.j / totalJ) * 50 : 0,
        finalScore: (totalP > 0 ? (pts.p / totalP) * 50 : 0) + (totalJ > 0 ? (pts.j / totalJ) * 50 : 0),
    })).sort((a, b) => b.finalScore - a.finalScore);
}

export async function GET(_req: Request, { params }: { params: Promise<{ contest: string }> }) {
    const { contest } = await params;
    if (!VALID_CONTESTS.includes(contest)) return NextResponse.json({ error: 'Concours invalide' }, { status: 400 });

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const payload = token ? await verifyToken(token) : null;
        if (!payload) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const voteKey = contest === 'video' ? 'voteVideoOpen' : 'voteRugbyOpen';
        const resultsKey = contest === 'video' ? 'resultsVideoVisible' : 'resultsRugbyVisible';

        const [activeGroups, votes, myVote, user, voteSetting, resultsSetting] = await Promise.all([
            prisma.miageGroup.findMany({ where: { active: true }, orderBy: { order: 'asc' }, select: { name: true } }),
            prisma.vote.findMany({ where: { contest }, select: { first: true, second: true, third: true, isJury: true } }),
            prisma.vote.findUnique({ where: { userId_contest: { userId: payload.userId, contest } } }),
            prisma.user.findUnique({ where: { id: payload.userId }, select: { miage: true, isJury: true, isAdmin: true } }),
            prisma.setting.findUnique({ where: { key: voteKey } }),
            prisma.setting.findUnique({ where: { key: resultsKey } }),
        ]);

        const voteOpen = voteSetting?.value === 'true';
        const resultsVisible = resultsSetting?.value === 'true';

        return NextResponse.json({
            // Les scores ne sont envoyés au client que si les résultats sont publiés
            results: resultsVisible ? computeResults(votes, activeGroups) : [],
            hasVoted: !!myVote,
            myVote: myVote ? { first: myVote.first, second: myVote.second, third: myVote.third } : null,
            isJury: user?.isJury ?? false,
            userCity: user?.miage ?? null,
            totalVotes: resultsVisible ? votes.filter(v => !v.isJury).length : null,
            totalJuryVotes: resultsVisible ? votes.filter(v => v.isJury).length : null,
            voteOpen,
            resultsVisible,
        });
    } catch (error) {
        console.error('GET /api/votes/[contest]:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ contest: string }> }) {
    const { contest } = await params;
    if (!VALID_CONTESTS.includes(contest)) return NextResponse.json({ error: 'Concours invalide' }, { status: 400 });

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const payload = token ? await verifyToken(token) : null;
        if (!payload) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

        const settingKey = contest === 'video' ? 'voteVideoOpen' : 'voteRugbyOpen';
        const [setting, activeGroups, user] = await Promise.all([
            prisma.setting.findUnique({ where: { key: settingKey } }),
            prisma.miageGroup.findMany({ where: { active: true }, select: { name: true } }),
            prisma.user.findUnique({ where: { id: payload.userId }, select: { miage: true, isJury: true } }),
        ]);

        if (!setting || setting.value !== 'true') {
            return NextResponse.json({ error: 'Les votes ne sont pas encore ouverts pour ce concours' }, { status: 403 });
        }

        const { first, second, third } = await req.json() as { first: string; second: string; third: string };
        if (!first || !second || !third) return NextResponse.json({ error: 'Choix incomplets' }, { status: 400 });
        if (new Set([first, second, third]).size !== 3) return NextResponse.json({ error: 'Choix dupliqués' }, { status: 400 });

        const validNames = new Set(activeGroups.map(g => g.name));
        if (![first, second, third].every(c => validNames.has(c))) {
            return NextResponse.json({ error: 'Ville invalide ou non participante' }, { status: 400 });
        }

        const excluded = getExcludedCities(user?.miage ?? null);
        if ([first, second, third].some(c => excluded.includes(c))) {
            return NextResponse.json({ error: 'Vous ne pouvez pas voter pour votre propre groupe' }, { status: 400 });
        }

        const existing = await prisma.vote.findUnique({
            where: { userId_contest: { userId: payload.userId, contest } },
        });
        if (existing) {
            return NextResponse.json({ error: 'Vous avez déjà voté pour ce concours' }, { status: 409 });
        }

        await prisma.vote.create({
            data: { userId: payload.userId, contest, first, second, third, isJury: user?.isJury ?? false },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('POST /api/votes/[contest]:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
