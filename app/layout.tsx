import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import PublicShell from "@/components/PublicShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ravigupta.dev"),
  title: {
    default: "Ravi Gupta — Full Stack Developer & Founder",
    template: "%s | Ravi Gupta",
  },
  description:
    "Ravi Gupta is a Full Stack Developer and Founder of ARintelligenceX, based in Noida, India. Building real, scalable software solutions for businesses across India and the UK.",
  keywords: [
    "Ravi Gupta",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "ARintelligenceX",
    "Web Developer Noida",
    "Software Developer India",
  ],
  authors: [{ name: "Ravi Gupta", url: "https://github.com/ravigupta94" }],
  creator: "Ravi Gupta",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Ravi Gupta Portfolio",
    title: "Ravi Gupta — Full Stack Developer & Founder",
    description: "Full Stack Developer and Founder of ARintelligenceX. Building software that actually works.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Ravi Gupta — Full Stack Developer & Founder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ravi Gupta — Full Stack Developer & Founder",
    description: "Full Stack Developer and Founder of ARintelligenceX.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#0a0a0f] text-[#f8fafc]`}>
        <Providers>
          <PublicShell>{children}</PublicShell>
        </Providers>
      </body>
    </html>
  );
}