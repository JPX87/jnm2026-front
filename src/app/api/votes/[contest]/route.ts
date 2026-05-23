export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const PARIS_GROUP = ['Paris Cité', 'Paris Dauphine', 'Paris Saclay / Evry', 'Paris Saclay / Orsay', 'Paris Sorbonne'];
const VALID_CONTESTS = ['video', 'rugby'];
const ALL_CITIES = [
    'Aix-Marseille', 'Amiens', 'Antilles', 'Bordeaux', 'Grenoble',
    'Lille', 'Lyon', 'Mulhouse', 'Nancy', 'Nantes', 'Nice',
    'Paris Cité', 'Paris Dauphine', 'Paris Saclay / Evry', 'Paris Saclay / Orsay',
    'Paris Sorbonne', 'Rennes',
];

function getExcludedCities(miage: string | null): string[] {
    if (!miage) return [];
    if (PARIS_GROUP.includes(miage)) return PARIS_GROUP;
    return [miage];
}

type RawVote = { first: string; second: string; third: string; isJury: boolean };

function computeResults(votes: RawVote[]) {
    const points = new Map<string, { p: number; j: number }>();
    for (const city of ALL_CITIES) points.set(city, { p: 0, j: 0 });

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

        const [votes, myVote, user] = await Promise.all([
            prisma.vote.findMany({ where: { contest }, select: { first: true, second: true, third: true, isJury: true } }),
            prisma.vote.findUnique({ where: { userId_contest: { userId: payload.userId, contest } } }),
            prisma.user.findUnique({ where: { id: payload.userId }, select: { miage: true, isJury: true } }),
        ]);

        return NextResponse.json({
            results: computeResults(votes),
            hasVoted: !!myVote,
            myVote: myVote ? { first: myVote.first, second: myVote.second, third: myVote.third } : null,
            isJury: user?.isJury ?? false,
            userCity: user?.miage ?? null,
            totalVotes: votes.filter(v => !v.isJury).length,
            totalJuryVotes: votes.filter(v => v.isJury).length,
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

        const { first, second, third } = await req.json() as { first: string; second: string; third: string };
        if (!first || !second || !third) return NextResponse.json({ error: 'Choix incomplets' }, { status: 400 });
        if (new Set([first, second, third]).size !== 3) return NextResponse.json({ error: 'Choix dupliqués' }, { status: 400 });
        if (![first, second, third].every(c => ALL_CITIES.includes(c))) return NextResponse.json({ error: 'Ville invalide' }, { status: 400 });

        const settingKey = contest === 'video' ? 'voteVideoOpen' : 'voteRugbyOpen';
        const setting = await prisma.setting.findUnique({ where: { key: settingKey } });
        if (!setting || setting.value !== 'true') {
            return NextResponse.json({ error: 'Les votes ne sont pas encore ouverts pour ce concours' }, { status: 403 });
        }

        const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { miage: true, isJury: true } });
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
