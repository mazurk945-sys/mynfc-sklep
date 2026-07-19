import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pgTable, text, serial, decimal, integer } from 'drizzle-orm/pg-core';
import bcrypt from 'bcryptjs';

export async function GET() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: true });
  const db = drizzle(pool);
  const products = pgTable('products', { id: serial('id').primaryKey(), name: text('name'), price: decimal('price'), type: text('type'), quantity: integer('quantity') });
  const users = pgTable('users', { id: serial('id').primaryKey(), email: text('email').unique(), password: text('password'), role: text('role'), balance: decimal('balance') });

  try {
    const hp = await bcrypt.hash('admin', 10);
    await db.insert(users).values({ email: 'admin', password: hp, role: 'admin', balance: '9999' }).onConflictDoNothing();
    await db.insert(products).values([
      { name: 'Karta NFC Single', price: '15.00', type: 'single', quantity: 1 },
      { name: 'Pakiet 10 Kart NFC', price: '120.00', type: 'pack10', quantity: 10 }
    ]).onConflictDoNothing();
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ success: false, error: String(e) }); }
}
