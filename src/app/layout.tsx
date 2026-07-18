import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="bg-zinc-950 text-white antialiased">{children}</body>
    </html>
  );
}
