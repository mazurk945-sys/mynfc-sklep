import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body style={{background: 'black', color: 'white', margin: 0}}>{children}</body>
    </html>
  );
}
