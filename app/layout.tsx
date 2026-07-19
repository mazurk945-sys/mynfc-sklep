import "./globals.css";

export const metadata = {
  title: "MYNFC.PL - Sklep",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
