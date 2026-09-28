import type { Metadata } from "next"
import { Syne, DM_Sans, DM_Serif_Display } from "next/font/google"
import "./globals.css"

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal"],
  variable: "--font-dm-sans",
  display: "swap",
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Tony Does Design — Brand Identity & Creative Strategy",
    template: "%s | Tony Does Design",
  },
  description:
    "Philadelphia-based brand designer with 12+ years of institutional design thinking. I build brand identities for scaling businesses — the ones who've outgrown their first logo.",
  metadataBase: new URL("https://tonydoesdesign.com"),
  openGraph: {
    title: "Tony Does Design",
    description: "Your brand should walk into the room before you do.",
    url: "https://tonydoesdesign.com",
    siteName: "Tony Does Design",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tony Does Design",
    description: "Your brand should walk into the room before you do.",
    creator: "@officially.tonydoes",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${dmSerifDisplay.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
