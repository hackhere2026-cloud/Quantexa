import type { Metadata } from "next";
import { Orbitron, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  fallback: ["sans-serif"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
  fallback: ["serif"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://quantexa-hackhere.vercel.app"),
  title: "Quantexa 2026 | Personalised Vulnerability Triage — by HackHere",
  description: "Quantexa is a premier 24-hour vulnerability triage challenge presented by HackHere. Join builders, compete across frontier tracks, and solve real-world security challenges.",
  openGraph: {
    title: "Quantexa 2026 | Personalised Vulnerability Triage",
    description: "Presented by HackHere. September 12–13 in Coimbatore.",
    images: ["/fin.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${orbitron.variable} ${playfair.variable} ${inter.variable} bg-ink text-white antialiased selection:bg-crimson selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
