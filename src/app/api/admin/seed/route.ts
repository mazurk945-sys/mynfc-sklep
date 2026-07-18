import { db } from '@/db';
import { users, products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin'));
    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await db.insert(users).values({ email: 'admin', password: hashedPassword, name: 'Admin', role: 'admin', balance: '9999' });
    }
    const existingProducts = await db.select().from(products);
    if (existingProducts.length === 0) {
      await db.insert(products).values([
        { name: 'Pojedyncza karta NFC', price: '15.00', type: 'single', quantity: 1 },
        { name: 'Pakiet 4+1 (5 kart)', price: '60.00', type: 'pack4', quantity: 5 },
        { name: 'Pakiet 10 kart NFC', price: '120.00', type: 'pack10', quantity: 10 }
      ]);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
