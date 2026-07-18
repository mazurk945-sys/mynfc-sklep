import { NextResponse } from 'next/server';
import { loginUser } from '../../../../lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await loginUser(email, password);
    if (!user) return NextResponse.json({ error: 'Błędne dane' }, { status: 401 });
    return NextResponse.json({ success: true, user });
  } catch (e) {
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
