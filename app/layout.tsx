export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body style={{background: 'black', color: 'white', margin: 0, fontFamily: 'sans-serif'}}>{children}</body>
    </html>
  );
}
