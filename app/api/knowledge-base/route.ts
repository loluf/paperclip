import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const kbs = await prisma.knowledgeBase.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(kbs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const kb = await prisma.knowledgeBase.create({
    data: { userId, title, content },
  });

  return NextResponse.json(kb, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { id, title, content } = await req.json();

  const kb = await prisma.knowledgeBase.findFirst({ where: { id, userId } });
  if (!kb) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.knowledgeBase.update({
    where: { id },
    data: { title, content },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const kb = await prisma.knowledgeBase.findFirst({ where: { id, userId } });
  if (!kb) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.knowledgeBase.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
