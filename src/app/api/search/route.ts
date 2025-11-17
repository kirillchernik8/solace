import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextRequest } from 'next/server';
import { arrayContains, ilike, or, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const body = await request.json()
  const searchTerm = body.searchTerm ?? "";
  const pattern = `%${searchTerm}%`;
  const page = body.page ?? 1;
  const recordsPerPage = body.recordsPerPage ?? 5;

  const offset = (page - 1) * recordsPerPage

  const searched = await db.select()
    .from(advocates)
    .where(searchTerm ? or(
      ilike(advocates.firstName, pattern),
      ilike(advocates.lastName, pattern),
      ilike(advocates.city, pattern),
      ilike(advocates.degree, pattern),
      ilike(sql<string>`CAST(${advocates.yearsOfExperience} AS TEXT)`, pattern),
      arrayContains(advocates.specialties, pattern)
    ) : undefined
  );

  // TODO: cleanup
  const result = await db.select()
    .from(advocates)
    .where(searchTerm ? or(
      ilike(advocates.firstName, pattern),
      ilike(advocates.lastName, pattern),
      ilike(advocates.city, pattern),
      ilike(advocates.degree, pattern),
      ilike(sql<string>`CAST(${advocates.yearsOfExperience} AS TEXT)`, pattern),
      arrayContains(advocates.specialties, pattern)
    ) : undefined
  ).limit(recordsPerPage).offset(offset);

  return Response.json({ searched: result, count: searched.length });
}
