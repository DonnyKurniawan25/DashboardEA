import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoldShield AI — Trading Intelligence Dashboard",
  description: "Real-time AI-powered trading intelligence dashboard for MetaTrader 5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
