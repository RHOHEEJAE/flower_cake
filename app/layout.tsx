import type { Metadata, Viewport } from "next"
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google"
import "./globals.css"

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
})

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-serif-kr",
  display: "swap",
})

export const metadata: Metadata = {
  title: "花菓子 | 수제 화과자",
  description: "전통의 맛과 현대적 감각이 만나는 수제 화과자 브랜드",
}

export const viewport: Viewport = {
  themeColor: "#FDFAF5",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} ${notoSerifKr.variable}`}>
      <body className="font-sans bg-brand-bg text-brand-dark min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
