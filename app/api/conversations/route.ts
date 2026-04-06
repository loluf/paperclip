import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;
  const convos = await prisma.conversation.findMany({
    where: { userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 1,
      },
      _count: { select: { messages: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return NextResponse.json(convos);
}
