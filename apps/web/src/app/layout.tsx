import type { Metadata } from "next";
import { IBM_Plex_Mono, VT323 } from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { site } from "@/lib/site";
import "./globals.css";

const vt323 = VT323({
  variable: "--font-terminal",
  subsets: ["latin"],
  weight: "400",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${site.name} — Private CTF Drops`,
  description:
    "Solve limited-time CTF Drops, prove completion privately on Midnight, and claim exclusive Wings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${vt323.variable} ${plexMono.variable} h-full`}
    >
      <body className="crt-root flex min-h-full flex-col">
        <ConvexClientProvider>
          <SiteHeader />
          <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 px-4 py-5 md:px-6 md:py-6">
            {children}
          </main>
          <SiteFooter />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
