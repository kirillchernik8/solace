import db from "../../../db";
import { advocates } from "../../../db/schema";
import { NextRequest } from 'next/server';
import { arrayContains, ilike, or, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const body = await request.json()
  const searchTerm = body.searchTerm ?? "";
  const pattern = `%${searchTerm}%`;

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
  console.log("Search results:", searched);
  return Response.json({ searched, count: searched.length });
}
