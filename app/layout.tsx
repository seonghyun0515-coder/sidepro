import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// next/font/google은 폰트를 최적화해서 불러오고,
// variable 옵션으로 CSS 변수 이름을 만들어 줍니다.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});

// metadata는 브라우저 탭 제목, 설명 등 문서 메타 정보를 담당합니다.
export const metadata: Metadata = {
  title: "BenefitON",
  description: "청년 맞춤 혜택 추천 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        // 전역 폰트 변수와 기본 배경색을 body에 적용합니다.
        className={`${manrope.variable} ${plusJakartaSans.variable} bg-slate-50 text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
