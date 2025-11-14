import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json()
  const page = body.page ?? 1;
  const recordsPerPage = body.recordsPerPage ?? 5;
  console.log("Fetching advocates for page:", page, "with records per page:", recordsPerPage);
  const offset = (page - 1) * recordsPerPage

  const data = await db.select().from(advocates).limit(recordsPerPage).offset(offset);

  return Response.json({ data });
}
