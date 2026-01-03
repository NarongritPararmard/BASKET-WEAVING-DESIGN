import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PatternProvider } from "../store/patternStore";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Basket Weaver - Pattern Design & Weaving Assistant",
  description: "A professional tool for basket weavers to design patterns and follow step-by-step instructions in real-life weaving.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased bg-slate-950 text-slate-50 min-h-screen`}>
        <PatternProvider>
          {children}
        </PatternProvider>
      </body>
    </html>
  );
}

