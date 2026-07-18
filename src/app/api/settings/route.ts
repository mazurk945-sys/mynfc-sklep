import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json([
    { id: 1, name: "Przelew", type: "data", content: "Nr konta: PL 00..." },
    { id: 2, name: "PayPal", type: "link", content: "https://paypal.me" }
  ]);
}
