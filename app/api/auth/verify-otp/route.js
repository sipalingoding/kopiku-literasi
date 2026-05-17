import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { userId, code } = await req.json();

    if (!userId || !code) {
      return NextResponse.json({ error: 'Data tidak lengkap.' }, { status: 400 });
    }

    const otp = await prisma.otpCode.findFirst({
      where: {
        userId,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      return NextResponse.json({ error: 'Kode OTP salah atau sudah kadaluarsa.' }, { status: 400 });
    }

    // Tandai OTP sudah digunakan & verifikasi user
    await prisma.$transaction([
      prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } }),
      prisma.user.update({ where: { id: userId }, data: { verified: true } }),
    ]);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error('[verify-otp]', err);
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
