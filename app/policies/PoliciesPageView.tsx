"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { apiUrl } from "../lib/api";

type RecommendationItem = {
  policy_id: string;
  category: "HOUSING" | "EMPLOYMENT" | "LIVING" | "EDUCATION";
  match_score: number;
  title: string;
  description: string;
  reason_tags: string[];
  reason_summary: string;
  deadline_label: string;
  deadline_date: string;
  action_label: string;
  accent: "blue" | "amber";
  is_urgent: boolean;
};

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M15 18H9" />
      <path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 3v2.2" />
      <path d="M12 18.8V21" />
      <path d="m4.9 4.9 1.6 1.6" />
      <path d="m17.5 17.5 1.6 1.6" />
      <path d="M3 12h2.2" />
      <path d="M18.8 12H21" />
      <path d="m4.9 19.1 1.6-1.6" />
      <path d="m17.5 6.5 1.6-1.6" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" />
    </svg>
  );
}

function AddTaskIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path d="M9 11h7" />
      <path d="M9 16h4" />
      <path d="m5 11 1.5 1.5L8.5 10" />
      <path d="M17 3v4" />
      <path d="M15 5h4" />
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
    </svg>
  );
}

function categoryLabel(category: RecommendationItem["category"]) {
  switch (category) {
    case "HOUSING":
      return "주거";
    case "EMPLOYMENT":
      return "고용";
    case "LIVING":
      return "생활";
    case "EDUCATION":
      return "교육";
  }
}

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRecommendations() {
      try {
        const response = await fetch(apiUrl("/policies/recommended"));
        if (!response.ok) {
          const errorPayload = (await response.json().catch(() => null)) as
            | { detail?: string }
            | null;
          throw new Error(
            errorPayload?.detail ?? "추천 정책을 불러오지 못했습니다.",
          );
        }

        const data = (await response.json()) as RecommendationItem[];
        if (!cancelled) {
          setPolicies(data);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "추천 정책을 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8f9fa_0%,_#eef3f8_100%)] text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-12">
            <Link
              href="/"
              className="font-headline text-2xl font-black tracking-tight text-blue-700"
            >
              BenefitON
            </Link>
            <div className="hidden gap-8 md:flex">
              <Link
                href="/"
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                홈
              </Link>
              <Link
                href="/policies"
                className="border-b-2 border-blue-600 pb-1 text-sm font-semibold text-blue-700"
              >
                추천 정책
              </Link>
              <Link
                href="/onboarding"
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                마이페이지
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="정책 검색..."
                className="w-64 rounded-full border-none bg-slate-100 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="notifications"
              >
                <BellIcon />
              </button>
              <button
                type="button"
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
                aria-label="settings"
              >
                <SettingsIcon />
              </button>
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-blue-200">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRurkjKR7j0j6PNq7G4iIf2bnkqyKtCwVOkEml24GqXYE68KorhS2dt3bMfBeC44RlxX4qJb0otaq9x_50jbejc8V6T8B86j9VswmV3ELsjkaPQ3ZY0zyafE9BiJAeW89e2UvIth1Va0LaJyjPU0YV362wZGUag08Ip0HkK0YuG3mEoxwfN3geTXpgLqXABgSRVB4fx4s1LHbbuhYKU6jmnpBGgijMuC_Q9uKmqCbRatjk3YCE9mpnL5aFy8F4_rckfILOJ7vrZTBu"
                  alt="User profile avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
        <header className="mb-12">
          <h1 className="font-headline text-4xl font-extrabold tracking-tight md:text-5xl">
            나에게 맞는 <span className="text-blue-700">추천 정책</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            온보딩 정보 기준으로 적합도가 높은 정책부터 불러오고 있습니다.
          </p>
        </header>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <span className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
              전체
            </span>
            <span className="rounded-full bg-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-600">
              추천순
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span>↕</span>
            정렬: 일치순
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
            추천 정책을 불러오는 중입니다...
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-sm text-rose-700">
            {errorMessage}
            <div className="mt-3">
              <Link href="/onboarding" className="font-semibold underline">
                온보딩 정보 입력하러 가기
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {policies.map((policy) => (
              <div
                key={policy.policy_id}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_-4px_rgba(25,28,29,0.04)] transition-all hover:-translate-y-1"
              >
                <div className="mb-4 flex items-start justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${
                      policy.accent === "blue"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-900"
                    }`}
                  >
                    {categoryLabel(policy.category)}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-900">
                    {policy.match_score}% 일치
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-bold leading-tight transition-colors group-hover:text-blue-700">
                  {policy.title}
                </h3>
                <p className="mb-3 text-sm leading-7 text-slate-600">
                  {policy.description}
                </p>
                <p className="mb-4 text-xs leading-6 text-slate-500">
                  {policy.reason_summary}
                </p>

                <div className="mb-6 mt-auto space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {policy.reason_tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-tight text-slate-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center gap-1 text-sm font-bold ${
                        policy.is_urgent ? "text-rose-600" : "text-slate-500"
                      }`}
                    >
                      <ClockIcon />
                      {policy.deadline_label}
                    </div>
                    <div className="text-xs text-slate-500">
                      마감일: {policy.deadline_date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-slate-200 pt-4">
                  <Link
                    href={`/policy-detail?policyId=${policy.policy_id}`}
                    className="flex-grow rounded-lg bg-[linear-gradient(135deg,_#0050cb_0%,_#0066ff_100%)] py-2.5 text-center text-sm font-bold text-white transition active:scale-95"
                  >
                    {policy.action_label}
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-100 p-2.5 text-slate-500 transition hover:text-blue-700"
                    aria-label="bookmark"
                  >
                    <BookmarkIcon />
                  </button>
                </div>
              </div>
            ))}

            {!policies.length && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
                추천 가능한 정책이 아직 없습니다. 온보딩 정보를 바꾸어 다시
                시도해 주세요.
              </div>
            )}

            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100/40 p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-blue-700">
                <AddTaskIcon />
              </div>
              <h4 className="mb-2 text-lg font-bold">프로필 업데이트</h4>
              <p className="mb-6 max-w-[200px] text-sm text-slate-600">
                정보를 수정하면 추천 결과도 함께 달라집니다.
              </p>
              <Link
                href="/onboarding"
                className="text-sm font-bold text-blue-700 hover:underline"
              >
                프로필 완성하기
              </Link>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 border-t border-slate-200/50 px-6 py-12 md:flex-row lg:px-8">
          <div>
            <span className="font-headline text-xl font-bold text-slate-900">
              BenefitON
            </span>
            <p className="mt-4 max-w-sm text-sm text-slate-500">
              © 2024 BenefitON. 스마트한 추천을 통한 청년 복지 증진에
              앞장섭니다.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              className="text-xs font-semibold uppercase tracking-wider text-slate-500 transition hover:text-blue-600 hover:underline"
              href="#"
            >
              이용약관
            </a>
            <a
              className="text-xs font-semibold uppercase tracking-wider text-slate-500 transition hover:text-blue-600 hover:underline"
              href="#"
            >
              개인정보처리방침
            </a>
            <a
              className="text-xs font-semibold uppercase tracking-wider text-slate-500 transition hover:text-blue-600 hover:underline"
              href="#"
            >
              고객지원
            </a>
            <a
              className="text-xs font-semibold uppercase tracking-wider text-slate-500 transition hover:text-blue-600 hover:underline"
              href="#"
            >
              회사소개
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
