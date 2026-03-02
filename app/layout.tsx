     1	import type { Metadata } from "next";
     2	import "./globals.css";
     3	
     4	export const metadata: Metadata = {
     5	  title: "dataBitBytes — Learn the Stack That Matters",
     6	  description: "A developer-focused blog covering the tech stack that actually matters. Deep dives into systems, code, and modern development.",
     7	};
     8	
     9	export default function RootLayout({
    10	  children,
    11	}: Readonly<{
    12	  children: React.ReactNode;
    13	}>) {
    14	  return (
    15	    <html lang="en">
    16	      <head>
    17	        <link rel="preconnect" href="https://fonts.googleapis.com" />
    18	        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    19	        <link
    20	          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap"
    21	          rel="stylesheet"
    22	        />
    23	      </head>
    24	      <body className="antialiased">
    25	        <div className="grid-bg" />
    26	        <div className="noise-overlay" />
    27	        {children}
    28	      </body>
    29	    </html>
    30	  );
    31	}
    32	
