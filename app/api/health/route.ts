import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  return NextResponse.json({
    dbUrl: dbUrl ? "set" : "NOT SET",
    dbUrlLength: dbUrl?.length ?? 0,
    dbUrlPrefix: dbUrl ? dbUrl.slice(0, 30) + "..." : null,
    nodeEnv: process.env.NODE_ENV,
  });
}
