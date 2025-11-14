import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json()
  const page = body.page ?? 1;
  const data = await db.select().from(advocates).limit(5).offset((page - 1) * 5);

  return Response.json({ data });
}
