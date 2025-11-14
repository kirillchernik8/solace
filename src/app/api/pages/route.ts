import db from "../../../db";
import { advocates } from "../../../db/schema";
import { count } from 'drizzle-orm';

export async function GET() {
  const data = await db.select({ count: count() }).from(advocates);
  return Response.json({ data });
}
