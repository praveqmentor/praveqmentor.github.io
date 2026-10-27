import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRAVEQ Mentor",
  description: "英語を武器に、世界を切り開け。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
