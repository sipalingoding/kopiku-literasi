import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function PUT(req, { params }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  // Admin bisa ubah ke status apapun
  if (session.user.role === 'admin') {
    // Ambil data booking dulu SEBELUM update supaya dapat pickupDate & returnDate asli
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Booking tidak ditemukan.' }, { status: 404 });

    const booking = await prisma.booking.update({ where: { id }, data: { status } });

    // Jika admin approve (active), auto-cancel semua booking lain yang beririsan
    if (status === 'active') {
      const cancelled = await prisma.booking.updateMany({
        where: {
          id: { not: id },
          bookId: existing.bookId,
          status: 'pending',
          pickupDate: { lte: existing.returnDate },
          returnDate: { gte: existing.pickupDate },
        },
        data: {
          status: 'cancelled',
          cancelReason: 'Buku telah dipinjam oleh pengguna lain pada periode yang sama.',
        },
      });
      console.log(`[auto-cancel] ${cancelled.count} booking dibatalkan untuk bookId=${existing.bookId}`);
    }

    return NextResponse.json(booking);
  }

  // User hanya boleh cancel booking milik sendiri yang masih pending
  if (status === 'cancelled') {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return NextResponse.json({ error: 'Booking tidak ditemukan.' }, { status: 404 });
    if (booking.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    if (booking.status !== 'pending') return NextResponse.json({ error: 'Hanya booking menunggu yang bisa dibatalkan.' }, { status: 400 });

    const updated = await prisma.booking.update({ where: { id }, data: { status: 'cancelled' } });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
}
