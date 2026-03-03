import type { Metadata } from "next";
import "./globals.css";
import CursorProvider from "@/components/cursor-provider";

export const metadata: Metadata = {
  title: "dataBitBytes — Learn the Stack That Matters",
  description:
    "A developer-focused blog covering the tech stack that actually matters. Deep dives into systems, code, and modern development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="grid-bg" />
        <div className="noise-overlay" />
        <CursorProvider />
        {children}
      </body>
    </html>
  );
}