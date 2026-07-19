import type { Metadata } from "next";
import { IBM_Plex_Mono, Syne } from "next/font/google";
import { SiteHeader } from "@/components/layout/site-header";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Dragonfly — Private CTF Drops",
  description:
    "Solve limited-time CTF Drops, prove completion privately on Midnight, and claim exclusive Wings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${plexMono.variable} h-full`}>
      <body className="min-h-full bg-[#020617] text-slate-100 antialiased">
        <ConvexClientProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
