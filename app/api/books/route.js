import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      bookings: {
        where: { status: 'active' },
        select: { returnDate: true },
        orderBy: { returnDate: 'asc' },
        take: 1,
      },
    },
  });

  const result = books.map(({ bookings, ...book }) => ({
    ...book,
    isBooked: bookings.length > 0,
    activeReturnDate: bookings[0]?.returnDate ?? null,
  }));

  return NextResponse.json(result);
}

export async function POST(req) {
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const data = await req.json();
  const book = await prisma.book.create({
    data: {
      title: data.title,
      author: data.author,
      category: data.category,
      color: data.color,
      rating: data.rating ?? 4.5,
      pages: parseInt(data.pages),
      year: parseInt(data.year),
      desc: data.desc,
      stock: 1,
    },
  });

  return NextResponse.json(book, { status: 201 });
}
