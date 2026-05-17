import nodemailer from 'nodemailer';

export async function sendOtpEmail(to, name, code) {
  if (process.env.OTP_DEMO_MODE === 'true') {
    console.log(`[OTP DEMO] Kode untuk ${to}: ${code}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `Kopiku Literasi <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Kode OTP — Kopiku Literasi',
    html: `
      <div style="font-family:'Nunito',sans-serif;max-width:480px;margin:0 auto;background:#FFFDF7;border:1px solid #E0CEAD;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#6B3A2A,#C17A2A);padding:32px 28px;text-align:center;">
          <h1 style="color:#E8C07A;margin:0;font-size:22px;letter-spacing:0.5px;">Kopiku Literasi</h1>
          <p style="color:rgba(232,192,122,0.7);margin:6px 0 0;font-size:13px;">Perpustakaan Pribadi</p>
        </div>
        <div style="padding:32px 28px;">
          <p style="color:#3A2212;font-size:16px;margin:0 0 8px;">Halo, <strong>${name}</strong>!</p>
          <p style="color:#7A5A42;font-size:14px;line-height:1.6;margin:0 0 28px;">
            Gunakan kode OTP berikut untuk memverifikasi akunmu. Kode berlaku selama <strong>10 menit</strong>.
          </p>
          <div style="text-align:center;background:#FBF5E6;border:2px dashed #C17A2A;border-radius:12px;padding:24px;margin-bottom:28px;">
            <div style="font-size:42px;font-weight:800;color:#6B3A2A;letter-spacing:12px;">${code}</div>
          </div>
          <p style="color:#9B6347;font-size:12px;line-height:1.6;margin:0;">
            Jika kamu tidak mendaftar di Kopiku Literasi, abaikan email ini.
          </p>
        </div>
      </div>
    `,
  });
}
