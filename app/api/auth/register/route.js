import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Semua field wajib diisi.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar.' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: 'user', verified: false },
    });

    // Generate 6-digit OTP
    const code = process.env.OTP_DEMO_MODE === 'true'
      ? '123456'
      : String(Math.floor(100000 + Math.random() * 900000));

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

    await prisma.otpCode.create({
      data: { userId: user.id, code, expiresAt },
    });

    // Kirim email OTP
    await sendOtpEmail(email, name, code);

    return NextResponse.json({ userId: user.id, email });
  } catch (err) {
    console.error('[register]', err);
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
