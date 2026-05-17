import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function sendMail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
    });
}

export async function sendMailToAll(
    emails: string[],
    subject: string,
    html: string,
): Promise<{ sent: number; failed: string[] }> {
    let sent = 0;
    const failed: string[] = [];

    await Promise.all(
        emails.map(async (email) => {
            try {
                await sendMail({ to: email, subject, html });
                sent++;
            } catch {
                failed.push(email);
            }
        }),
    );

    return { sent, failed };
}
