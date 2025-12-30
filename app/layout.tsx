import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenNana 提示词图库",
  description: "Nano Banana 提示词案例集合",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
