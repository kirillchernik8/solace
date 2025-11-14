import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json()
  const page = body.page ?? 1;
  const recordsPerPage = body.recordsPerPage ?? 5;
  // TODO: where is 5 coming from?
  const data = await db.select().from(advocates).limit(recordsPerPage).offset((page - 1) * recordsPerPage);

  return Response.json({ data });
}
