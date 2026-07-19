import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json([
    { id: 1, name: "PRZELEW", type: "data", content: "NR KONTA: WPISZ W PANELU ADMINA" },
    { id: 2, name: "PAYPAL", type: "link", content: "https://paypal.me" }
  ]);
}
