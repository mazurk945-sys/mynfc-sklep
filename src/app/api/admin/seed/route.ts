import { db } from '../../../../db';
import { users, products } from '../../../../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('admin', 10);
    await db.insert(users).values({ 
      email: 'admin', 
      password: hashedPassword, 
      name: 'Admin', 
      role: 'admin', 
      balance: '9999',
      emailVerified: true 
    }).onConflictDoNothing();

    await db.insert(products).values([
      { name: 'Karta NFC Single', price: '15.00', type: 'single', quantity: 1 },
      { name: 'Pakiet 4+1 NFC', price: '60.00', type: 'pack4', quantity: 5 },
      { name: 'Pakiet 10 Kart NFC', price: '120.00', type: 'pack10', quantity: 10 }
    ]).onConflictDoNothing();

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) });
  }
}
