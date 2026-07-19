import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, text, serial, decimal, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import bcrypt from 'bcryptjs';

export async function GET() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  const users = pgTable('users', { id: serial('id').primaryKey(), email: text('email').notNull().unique(), password: text('password').notNull(), role: text('role').default('customer'), balance: decimal('balance').default('0'), emailVerified: boolean('email_verified').default(false) });
  const products = pgTable('products', { id: serial('id').primaryKey(), name: text('name').notNull(), price: decimal('price').notNull(), type: text('type').notNull(), quantity: integer('quantity').notNull() });

  try {
    const hp = await bcrypt.hash('admin', 10);
    await db.insert(users).values({ email: 'admin', password: hp, role: 'admin', balance: '9999', emailVerified: true }).onConflictDoNothing();
    await db.insert(products).values([
      { name: 'Pojedyncza karta NFC', price: '15.00', type: 'single', quantity: 1 },
      { name: 'Pakiet 4+1 (5 kart)', price: '60.00', type: 'pack4', quantity: 5 },
      { name: 'Pakiet 10 kart NFC', price: '120.00', type: 'pack10', quantity: 10 }
    ]).onConflictDoNothing();
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ success: false, error: String(e) }); }
}
