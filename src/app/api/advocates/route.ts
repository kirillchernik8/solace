import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextRequest } from 'next/server';
import type { InferSelectModel } from "drizzle-orm";

type Advocate = InferSelectModel<typeof advocates>;
export async function POST(request: NextRequest) {
  const body = await request.json()

  const page = body.page ?? 1;
  const recordsPerPage = body.recordsPerPage ?? 5;

  const offset = (page - 1) * recordsPerPage

  const data: Array<Advocate> = await db.select().from(advocates).limit(recordsPerPage).offset(offset);

  return Response.json({ data });
}
