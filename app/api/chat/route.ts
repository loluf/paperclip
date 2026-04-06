import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  const { widgetId, visitorId, message, conversationId } = await req.json();

  if (!widgetId || !visitorId || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400, headers: corsHeaders() }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: widgetId },
    include: { knowledgeBases: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Widget not found" },
      { status: 404, headers: corsHeaders() }
    );
  }

  let convo = conversationId
    ? await prisma.conversation.findUnique({ where: { id: conversationId } })
    : null;

  if (!convo) {
    convo = await prisma.conversation.create({
      data: { userId: user.id, visitorId, widgetId },
    });
  }

  const prevMessages = await prisma.message.findMany({
    where: { conversationId: convo.id },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  await prisma.message.create({
    data: { conversationId: convo.id, role: "user", content: message },
  });

  const kbContent = user.knowledgeBases
    .map((kb) => `## ${kb.title}\n${kb.content}`)
    .join("\n\n");

  const systemPrompt = `You are a helpful customer support assistant for ${user.businessName || user.name || "this business"}.

Use the following knowledge base to answer customer questions accurately and helpfully. If the question isn't covered in the knowledge base, be honest and suggest they contact support directly.

<knowledge_base>
${kbContent || "No knowledge base configured yet. Please answer generally and suggest the customer contact support."}
</knowledge_base>

Be concise, friendly, and professional. Don't make up information not in the knowledge base.`;

  const messages: Anthropic.MessageParam[] = prevMessages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));
  messages.push({ role: "user", content: message });

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const assistantMessage =
    response.content[0].type === "text" ? response.content[0].text : "";

  await prisma.message.create({
    data: {
      conversationId: convo.id,
      role: "assistant",
      content: assistantMessage,
    },
  });

  await prisma.conversation.update({
    where: { id: convo.id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(
    { conversationId: convo.id, message: assistantMessage },
    { headers: corsHeaders() }
  );
}
