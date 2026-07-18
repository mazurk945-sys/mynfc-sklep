import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function loginUser(email: string, password: string) {
  try {
    const res = await db.select().from(users).where(eq(users.email, email));
    if (!res[0]) return null;
    const valid = await bcrypt.compare(password, res[0].password);
    return valid ? res[0] : null;
  } catch (e) {
    return null;
  }
}
