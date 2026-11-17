import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Gaegu } from "next/font/google";
import "./globals.css";

/** 손글씨 폰트 (한글 포함 전체 글리프를 셀프호스팅 → 이미지 저장에도 그대로 나옴) */
const hand = Gaegu({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-hand", display: "swap" });

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: "내 첫 요가매트 찾기 | 질문 8개로 끝내는 매트 고민",
  description: "땀손? 무릎 예민? 가성비? 질문 8개에 답하면 나한테 맞는 요가매트를 골라드려요.",
  openGraph: {
    title: "내 첫 요가매트 찾기 🧘",
    description: "질문 8개, 1분이면 매트 고민 끝",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2B3E2F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={hand.variable}>
      <body>
        {children}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
