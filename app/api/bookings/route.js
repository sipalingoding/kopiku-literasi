import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const bookId = searchParams.get('bookId');

  let where = {};
  if (userId) where.userId = userId;
  if (bookId) where.bookId = parseInt(bookId);

  // User biasa hanya bisa lihat booking sendiri
  if (session.user.role !== 'admin' && !userId) {
    where.userId = session.user.id;
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: { book: { select: { color: true, title: true, author: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(bookings);
}

export async function POST(req) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();

  // Cek apakah buku sudah aktif dibooking
  const activeBooking = await prisma.booking.findFirst({
    where: {
      bookId: data.bookId,
      status: { in: ['pending', 'confirmed', 'active'] },
    },
  });

  if (activeBooking) {
    return NextResponse.json({ error: 'Buku sedang dipinjam.' }, { status: 400 });
  }

  const booking = await prisma.booking.create({
    data: {
      bookId: data.bookId,
      userId: session.user.id,
      userName: session.user.name,
      duration: data.duration,
      durationLabel: data.durationLabel,
      note: data.note || null,
      pickupDate: new Date(data.pickupDate),
      returnDate: new Date(data.returnDate),
      status: 'pending',
    },
    include: { book: { select: { color: true, title: true, author: true } } },
  });

  return NextResponse.json(booking, { status: 201 });
}
