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

export async function sendWelcomeEmail({
    to,
    firstname,
    password,
}: {
    to: string;
    firstname?: string | null;
    password: string;
}) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
    const name = firstname ? ` ${firstname}` : '';
    const appUrl = `${siteUrl}/app`;
    const logoSvg = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2497 1200" preserveAspectRatio="xMidYMid meet"><g transform="translate(0,1200) scale(0.1,-0.1)" fill="#FFFFFF" stroke="none"><path d="M4650 11455 l0 -65 90 0 90 0 0 -250 0 -250 -90 0 -90 0 -3 -3707 -3 -3708 -21 -95 c-100 -452 -376 -794 -769 -951 -225 -90 -500 -93 -742 -7 -384 135 -677 446 -805 854 -26 82 -57 261 -57 328 l0 36 -60 0 -60 0 0 250 0 250 54 0 c30 0 57 3 59 8 3 4 2 33 0 64 l-5 58 -959 0 -959 0 0 -65 0 -65 80 0 80 0 0 -250 0 -250 -81 0 -81 0 6 -87 c19 -235 71 -515 142 -760 288 -995 947 -1722 1879 -2072 236 -88 505 -153 780 -188 167 -21 594 -24 750 -5 771 93 1395 381 1885 872 497 496 796 1152 892 1955 11 89 13 815 13 3820 l0 3710 -92 3 -93 3 0 249 0 250 95 0 95 0 0 65 0 65 -1010 0 -1010 0 0 -65z m490 -315 l0 -250 -90 0 -90 0 0 250 0 250 90 0 90 0 0 -250z m300 0 l0 -250 -85 0 -85 0 0 250 0 250 85 0 85 0 0 -250z m300 0 l0 -250 -35 0 -35 0 0 -160 c0 -212 -19 -214 -22 -2 l-3 157 -37 3 -38 3 0 250 0 249 85 0 85 0 0 -250z m310 0 l0 -250 -85 0 -85 0 0 250 0 250 85 0 85 0 0 -250z m300 0 l0 -250 -85 0 -85 0 0 250 0 250 85 0 85 0 0 -250z m-5560 -7250 l0 -250 -90 0 -90 0 0 250 0 250 90 0 90 0 0 -250z m300 0 l0 -250 -85 0 -85 0 0 250 0 250 85 0 85 0 0 -250z m310 0 l0 -250 -42 0 -41 0 6 -107 c4 -60 9 -123 13 -140 4 -20 2 -33 -3 -33 -10 0 -16 42 -29 198 l-7 82 -38 0 -39 0 0 250 0 250 90 0 90 0 0 -250z m300 0 l0 -250 -90 0 -90 0 0 250 0 250 90 0 90 0 0 -250z m300 0 l0 -250 -85 0 -85 0 0 250 0 250 85 0 85 0 0 -250z"/><path d="M7560 6215 l0 -5305 940 0 940 0 0 1225 0 1225 1670 0 1670 0 0 -1225 0 -1225 1080 0 1080 0 0 5305 0 5305 -1080 0 -1080 0 -2 -2347 -3 -2348 -1638 2348 -1639 2347 -969 0 -969 0 0 -5305z m3590 52 l0 -254 74 -37 c91 -45 178 -128 225 -215 l32 -61 -365 0 c-215 0 -366 4 -366 9 0 5 23 44 51 86 56 84 135 150 227 191 l52 24 0 255 0 255 35 0 35 0 0 -253z m340 -913 l0 -206 -23 6 c-13 3 -99 10 -191 17 -158 10 -422 1 -516 -17 l-30 -6 0 206 0 206 380 0 380 0 0 -206z m-109 -360 c440 -61 835 -270 1075 -568 191 -237 296 -511 320 -840 l7 -96 -1673 0 -1673 0 6 118 c14 251 94 493 237 712 83 127 261 303 396 393 223 148 502 250 784 286 114 15 401 12 521 -5z"/><path d="M15870 6217 l0 -5304 1001 -7 c551 -4 1005 -4 1009 1 4 4 -10 1538 -31 3408 -21 1870 -38 3509 -39 3643 l0 242 23 0 c18 -1 174 -233 927 -1385 l905 -1385 191 0 c139 0 193 3 203 13 6 6 395 627 864 1380 l852 1367 37 0 36 0 -5 -302 c-16 -945 -70 -4894 -66 -4900 2 -5 119 -8 259 -8 l254 0 0 -249 0 -249 -22 -6 c-13 -3 -130 -6 -261 -6 l-237 0 2 -782 3 -783 265 0 265 0 3 253 2 252 261 0 261 0 -4 -253 -3 -252 278 -3 277 -2 0 255 0 255 265 0 265 0 0 540 0 540 -260 0 -260 0 0 250 0 250 260 0 260 0 -2 4263 -3 4262 -1076 3 -1076 2 -923 -1462 c-508 -805 -928 -1468 -934 -1475 -8 -9 -248 366 -935 1463 l-925 1474 -1083 0 -1083 0 0 -5303z"/><path d="M1455 6944 l-160 -43 -140 39 c-200 57 -235 53 -235 -22 0 -35 9 -46 131 -165 72 -70 134 -135 139 -143 4 -8 -11 -187 -34 -397 -33 -301 -45 -386 -58 -399 -15 -15 -48 1 -435 215 -230 127 -429 231 -441 231 -39 0 -62 -34 -62 -93 0 -66 -34 -32 480 -472 217 -186 412 -354 433 -373 l37 -36 0 -91 c0 -227 35 -422 93 -529 58 -105 110 -112 177 -23 65 85 87 193 98 480 l7 172 470 382 c259 210 478 392 488 404 11 14 17 38 17 70 0 63 -27 94 -74 86 -17 -3 -222 -104 -455 -225 -233 -121 -430 -218 -437 -215 -7 2 -15 11 -18 18 -3 8 -19 189 -37 402 l-31 388 146 141 c135 130 146 143 146 177 0 39 -28 68 -65 66 -11 0 -92 -21 -180 -45z"/><path d="M9740 3027 c-30 -16 -51 -37 -67 -67 l-23 -43 0 -454 0 -453 170 0 170 0 0 453 c0 450 0 453 -22 497 -42 83 -143 112 -228 67z"/><path d="M11035 3041 c-59 -15 -106 -44 -150 -93 -73 -82 -75 -93 -75 -545 l0 -393 298 2 297 3 0 400 c-1 446 -1 446 -70 531 -64 77 -202 121 -300 95z"/><path d="M12290 3028 c-33 -17 -51 -35 -67 -68 -23 -44 -23 -47 -23 -497 l0 -453 170 0 170 0 0 453 c0 454 0 454 -23 498 -26 51 -89 89 -147 89 -20 0 -56 -10 -80 -22z"/><path d="M24115 1461 c-93 -104 -171 -197 -173 -208 -2 -16 42 -61 182 -187 102 -91 192 -166 200 -166 17 0 366 377 366 396 0 16 -376 354 -393 353 -7 0 -88 -85 -182 -188z"/></g></svg>`;
    const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`;

    await sendMail({
        to,
        subject: 'Bienvenue aux JNM 2026 – Vos identifiants de connexion',
        html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#ef6a9f;padding:36px 40px;text-align:center;">
            <img src="${logoDataUri}" alt="JNM 2026" width="200" style="display:block;margin:0 auto 14px;max-width:200px;" />
            <p style="margin:0;color:rgba(255,255,255,0.9);font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Journées Nationales MIAGE 2026</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1a1a1a;">
              Bienvenue${name}&nbsp;! ✈️
            </h1>
            <p style="margin:0 0 28px;font-size:15px;color:#666;line-height:1.6;">
              Votre compte a été créé pour les JNM 2026 à Toulouse.<br>
              Voici vos identifiants pour accéder à votre espace personnel.
            </p>

            <!-- Credentials box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff5f9;border:1px solid #ffd6e8;border-radius:12px;margin-bottom:28px;">
              <tr>
                <td style="padding:20px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #ffd6e8;">
                        <span style="font-size:11px;font-weight:700;color:#ef6a9f;text-transform:uppercase;letter-spacing:1px;">Email</span><br>
                        <span style="font-size:15px;color:#1a1a1a;font-weight:500;">${to}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0 0;">
                        <span style="font-size:11px;font-weight:700;color:#ef6a9f;text-transform:uppercase;letter-spacing:1px;">Mot de passe</span><br>
                        <span style="font-size:15px;color:#1a1a1a;font-family:monospace;font-weight:600;letter-spacing:1px;">${password}</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-bottom:8px;">
                  <a href="${appUrl}" style="display:inline-block;background:linear-gradient(135deg,#ff89b8 0%,#ef6a9f 100%);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 40px;border-radius:50px;letter-spacing:0.5px;">
                    Accéder à mon espace →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #f0f0f0;margin:0;"></td></tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;text-align:center;">
            <p style="margin:0 0 6px;font-size:13px;color:#999;">
              Toulouse · 26–29 mai 2026
            </p>
            <p style="margin:0;font-size:12px;color:#bbb;">
              Si vous n'attendiez pas ce message, ignorez cet email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });
}
