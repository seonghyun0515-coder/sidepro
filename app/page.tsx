import Link from "next/link";

export default function HomePage() {
  return (
    // app/page.tsx 는 "/" 경로에 대응하는 홈 페이지입니다.
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-12 text-center shadow-[0_20px_60px_-24px_rgba(15,23,42,0.25)]">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          BenefitON
        </p>
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-slate-950">
          청년 맞춤 혜택 추천 서비스
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
          온보딩 화면을 Next.js + React + TypeScript 구조로 옮겼습니다.
          아래 링크에서 바로 확인할 수 있습니다.
        </p>
        <Link
          href="/onboarding"
          // next/link는 Next.js 내부 페이지 이동에 사용하는 기본 링크입니다.
          className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
        >
          온보딩 페이지 보기
        </Link>
      </div>
    </main>
  );
}
