import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function PUT(req, { params }) {
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  const data = await req.json();

  const book = await prisma.book.update({
    where: { id: parseInt(id) },
    data: {
      title: data.title,
      author: data.author,
      category: data.category,
      color: data.color,
      rating: data.rating ?? 4.5,
      pages: parseInt(data.pages),
      year: parseInt(data.year),
      desc: data.desc,
    },
  });

  return NextResponse.json(book);
}

export async function DELETE(req, { params }) {
  const session = await auth();
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id } = await params;
  await prisma.book.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
