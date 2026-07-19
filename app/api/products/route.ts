import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, text, serial, decimal, integer } from 'drizzle-orm/pg-core';

export async function GET() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  const products = pgTable('products', { id: serial('id').primaryKey(), name: text('name').notNull(), price: decimal('price').notNull(), type: text('type').notNull(), quantity: integer('quantity').notNull() });
  const all = await db.select().from(products);
  return NextResponse.json(all);
}
