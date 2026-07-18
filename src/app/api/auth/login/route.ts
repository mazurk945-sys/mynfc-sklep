import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await loginUser(email, password);
  if (!user) return NextResponse.json({ error: 'Błędne dane' }, { status: 401 });
  return NextResponse.json({ success: true, user });
}
