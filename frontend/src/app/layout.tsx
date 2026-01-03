import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PatternProvider } from "../store/patternStore";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "ระบบออกแบบและช่วยสานตะกร้า - สำหรับนักเรียนชั้น ม.5",
  description: "เครื่องมือช่วยออกแบบลวดลายและแสดงขั้นตอนการสานตะกร้าแบบละเอียด เข้าใจง่าย สำหรับการเรียนการสอนวิชาศิลปหัตถกรรม",
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

