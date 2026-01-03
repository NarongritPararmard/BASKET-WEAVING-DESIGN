import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Basket Weaving Pattern Design",
  description: "Design and follow basket weaving patterns step by step",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

