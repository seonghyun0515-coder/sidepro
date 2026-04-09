"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { apiUrl } from "../lib/api";

type IconName =
  | "search"
  | "notifications"
  | "settings"
  | "location"
  | "payments"
  | "sparkles"
  | "robot"
  | "checklist"
  | "calendar"
  | "cursor"
  | "document"
  | "download"
  | "external";

type PolicyMetaItem = {
  label: string;
  value: string;
  icon: Extract<IconName, "location" | "payments">;
};

type PolicyDetailResponse = {
  id: string;
  title: string;
  category: "HOUSING" | "EMPLOYMENT" | "LIVING" | "EDUCATION";
  provider: string;
  summary: string;
  region_code: string;
  match_score: number;
  recommendation_reasons: string[];
  apply_start_date: string;
  apply_end_date: string;
  application_method: string;
  documents: string[];
  ai_summary: string;
  meta_items: PolicyMetaItem[];
};

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (name) {
    case "search":
      return (
        <svg {...commonProps}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      );
    case "notifications":
      return (
        <svg {...commonProps}>
          <path d="M15 18H9" />
          <path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2h16Z" />
        </svg>
      );
    case "settings":
      return (
        <svg {...commonProps}>
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
    case "location":
      return (
        <svg {...commonProps}>
          <path d="M12 20s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
          <circle cx="12" cy="10" r="2.3" />
        </svg>
      );
    case "payments":
      return (
        <svg {...commonProps}>
          <rect x="3" y="6" width="18" height="12" rx="2.5" />
          <path d="M7 12h10" />
          <path d="M9 9.5h.01" />
          <path d="M15 14.5h.01" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...commonProps}>
          <path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1L6.5 8.5l4.1-1.4Z" />
          <path d="m18.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" />
        </svg>
      );
    case "robot":
      return (
        <svg {...commonProps}>
          <rect x="5" y="7" width="14" height="10" rx="3" />
          <path d="M12 4v3" />
          <path d="M8 17v2" />
          <path d="M16 17v2" />
          <circle cx="9.5" cy="12" r="1" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "checklist":
      return (
        <svg {...commonProps}>
          <path d="M9 7h10" />
          <path d="M9 12h10" />
          <path d="M9 17h10" />
          <path d="m4 7 1.5 1.5L7.5 6" />
          <path d="m4 12 1.5 1.5L7.5 11" />
          <path d="m4 17 1.5 1.5L7.5 16" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...commonProps}>
          <rect x="3" y="5" width="18" height="16" rx="2.5" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="M3 10h18" />
        </svg>
      );
    case "cursor":
      return (
        <svg {...commonProps}>
          <path d="m5 4 12 7-5 1 2 6-2 1-2-6-4 3Z" />
        </svg>
      );
    case "document":
      return (
        <svg {...commonProps}>
          <path d="M8 3h6l5 5v13H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <path d="M14 3v5h5" />
        </svg>
      );
    case "download":
      return (
        <svg {...commonProps}>
          <path d="M12 4v10" />
          <path d="m8.5 10.5 3.5 3.5 3.5-3.5" />
          <path d="M5 19h14" />
        </svg>
      );
    case "external":
      return (
        <svg {...commonProps}>
          <path d="M14 5h5v5" />
          <path d="M10 14 19 5" />
          <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
        </svg>
      );
  }
}

function SummaryMetric({
  label,
  value,
  difficulty,
}: {
  label: string;
  value?: string;
  difficulty?: number;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-900/55">
        {label}
      </p>
      {value ? (
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      ) : (
        <div className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`h-1.5 w-7 rounded-full ${
                index < (difficulty ?? 0) ? "bg-emerald-700" : "bg-slate-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function categoryLabel(category: PolicyDetailResponse["category"]) {
  switch (category) {
    case "HOUSING":
      return "주거 지원";
    case "EMPLOYMENT":
      return "고용 지원";
    case "LIVING":
      return "생활 지원";
    case "EDUCATION":
      return "교육 지원";
  }
}

function difficultyLevel(method: string) {
  if (method.includes("온라인")) {
    return 1;
  }
  if (method.includes("방문")) {
    return 3;
  }
  return 2;
}

export default function PolicyDetailPage() {
  const searchParams = useSearchParams();
  const policyId = searchParams.get("policyId");
  const [policy, setPolicy] = useState<PolicyDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!policyId) {
      setErrorMessage("정책 ID가 없어 상세 정보를 불러올 수 없습니다.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadPolicy() {
      try {
        const response = await fetch(apiUrl(`/policies/${policyId}`));
        if (!response.ok) {
          const errorPayload = (await response.json().catch(() => null)) as
            | { detail?: string }
            | null;
          throw new Error(
            errorPayload?.detail ?? "정책 상세 정보를 불러오지 못했습니다.",
          );
        }

        const data = (await response.json()) as PolicyDetailResponse;
        if (!cancelled) {
          setPolicy(data);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "정책 상세 정보를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPolicy();

    return () => {
      cancelled = true;
    };
  }, [policyId]);

  const applicationSteps = policy
    ? policy.application_method.split(" 또는 ").map((description, index) => ({
        step: String(index + 1),
        description,
      }))
    : [];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(179,197,255,0.4),_transparent_22%),linear-gradient(180deg,_#f8f9fa_0%,_#eef2f7_100%)] text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-white/50 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="font-headline text-2xl font-black tracking-tight text-blue-700"
          >
            BenefitON
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              홈
            </Link>
            <Link
              href="/policies"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              추천 정책
            </Link>
            <Link
              href="/onboarding"
              className="border-b-2 border-blue-600 pb-1 text-sm font-semibold text-blue-700"
            >
              마이페이지
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <Icon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="정책 검색..."
                className="w-64 rounded-full border border-slate-200 bg-slate-100 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="button"
              aria-label="알림"
              className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
            >
              <Icon name="notifications" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>

            <button
              type="button"
              aria-label="설정"
              className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
            >
              <Icon name="settings" />
            </button>

            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEj8N8GHlyjanbf_ivH7AbeNvd8M8a9vYKgq5ci4es-qBj_3fp3I-QvslZUnOskqqRFjKpo0fZnlkuaJ1FrrmRchFYqTuArsb2W9FSkJ3AuWLyoFk-nkl6ulfMwWKMMCG7gbScsggHQrylrBKAubZdV8XkFg5nswMao5E9WtcFKM5y5fKJTw72giw_w3CXdwr6-Qx3Z7HxSZxzjcNFnjpzuz0olXyKWgHKp_lWwg9-Jqkuc8WFB9e0-QiZCv4jDwsR6RNrjmTNjDZ0"
              alt="사용자 프로필 이미지"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500/10"
            />
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
        {isLoading ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-sm text-slate-600">
            정책 상세 정보를 불러오는 중입니다...
          </div>
        ) : errorMessage || !policy ? (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-8 text-sm text-rose-700">
            {errorMessage || "정책 상세 정보를 찾을 수 없습니다."}
            <div className="mt-3">
              <Link href="/policies" className="font-semibold underline">
                추천 정책 목록으로 돌아가기
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <aside className="space-y-6 md:col-span-4">
              <div
                id="policy-detail"
                className="rounded-[28px] border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.28)]"
              >
                <div className="mb-6 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-blue-700">
                    {categoryLabel(policy.category)}
                  </span>
                  <span className="rounded-full bg-amber-200 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-amber-900">
                    {policy.apply_end_date}
                  </span>
                </div>

                <h1 className="font-headline text-3xl font-extrabold leading-tight tracking-tight text-slate-950">
                  {policy.title}
                </h1>
                <p className="mb-8 mt-4 leading-7 text-slate-600">
                  {policy.summary}
                </p>

                <div className="space-y-4 border-t border-slate-200 pt-6">
                  {policy.meta_items.map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="rounded-full bg-blue-50 p-2 text-blue-700">
                        <Icon name={item.icon} className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <button
                    type="button"
                    className="w-full rounded-2xl bg-[linear-gradient(135deg,_#0050cb_0%,_#0066ff_100%)] px-6 py-4 text-sm font-bold text-white shadow-[0_18px_36px_-20px_rgba(0,80,203,0.7)] transition hover:opacity-95 active:scale-[0.99]"
                  >
                    나의 자격 확인하기
                  </button>
                  <p className="mt-4 text-center text-xs text-slate-500">
                    예상 매칭 점수:{" "}
                    <span className="font-bold text-emerald-700">
                      {policy.match_score}%
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.28)]">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-slate-500">
                  추천 사유
                </h2>
                <div className="flex flex-wrap gap-2">
                  {policy.recommendation_reasons.map((reason) => (
                    <span
                      key={reason}
                      className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </div>
            </aside>

            <section className="space-y-8 md:col-span-8">
              <div className="relative overflow-hidden rounded-[28px] border border-emerald-200/60 bg-[linear-gradient(135deg,_rgba(84,248,215,0.18)_0%,_rgba(255,255,255,0.9)_60%)] p-8">
                <div className="absolute right-5 top-5 text-emerald-700/20">
                  <Icon name="sparkles" className="h-16 w-16" />
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <Icon name="robot" className="h-5 w-5 text-emerald-700" />
                  <h2 className="font-headline text-lg font-bold text-emerald-900">
                    AI 쉬운 말 요약
                  </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <SummaryMetric label="주관 기관" value={policy.provider} />
                  <SummaryMetric
                    label="핵심 혜택"
                    value={policy.meta_items[1]?.value ?? policy.application_method}
                  />
                  <SummaryMetric
                    label="신청 난이도"
                    difficulty={difficultyLevel(policy.application_method)}
                  />
                </div>

                <p className="mt-6 text-sm leading-7 text-slate-700">
                  {policy.ai_summary}
                </p>
              </div>

              <div className="rounded-[28px] border border-white/70 bg-white/90 p-8 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.24)]">
                <h3 className="mb-6 flex items-center gap-2 font-headline text-xl font-bold text-slate-950">
                  <Icon name="checklist" className="h-5 w-5 text-blue-700" />
                  상세 지원 정보
                </h3>

                <div className="space-y-6">
                  <div className="grid items-start gap-4 border-b border-slate-200 pb-4 md:grid-cols-4">
                    <span className="text-sm font-bold uppercase tracking-tight text-slate-500">
                      모집 기간
                    </span>
                    <div className="text-sm leading-7 text-slate-700 md:col-span-3">
                      {policy.apply_start_date} ~ {policy.apply_end_date}
                    </div>
                  </div>
                  <div className="grid items-start gap-4 border-b border-slate-200 pb-4 md:grid-cols-4">
                    <span className="text-sm font-bold uppercase tracking-tight text-slate-500">
                      신청 방식
                    </span>
                    <div className="text-sm leading-7 text-slate-700 md:col-span-3">
                      {policy.application_method}
                    </div>
                  </div>
                  <div className="grid items-start gap-4 md:grid-cols-4">
                    <span className="text-sm font-bold uppercase tracking-tight text-slate-500">
                      대상 지역
                    </span>
                    <div className="text-sm leading-7 text-slate-700 md:col-span-3">
                      {policy.meta_items[0]?.value ?? policy.region_code}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-[28px] border border-slate-200/70 bg-slate-50/85 p-6">
                  <h3 className="mb-4 flex items-center gap-2 font-headline text-base font-bold text-slate-950">
                    <Icon name="calendar" className="h-5 w-5 text-blue-700" />
                    신청 기간
                  </h3>

                  <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-4">
                    <p className="text-sm font-bold text-blue-700">
                      {policy.apply_start_date} ~ {policy.apply_end_date}
                    </p>
                    <p className="mt-1 text-xs italic text-slate-500">
                      마감일을 꼭 확인해 주세요
                    </p>
                  </div>

                  <h3 className="mb-4 flex items-center gap-2 font-headline text-base font-bold text-slate-950">
                    <Icon name="cursor" className="h-5 w-5 text-blue-700" />
                    신청 방법
                  </h3>

                  <ul className="space-y-3 text-sm text-slate-700">
                    {applicationSteps.map((item) => (
                      <li key={item.step} className="flex gap-3">
                        <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                          {item.step}
                        </span>
                        <span>{item.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[28px] border border-slate-200/70 bg-slate-50/85 p-6">
                  <h3 className="mb-4 flex items-center gap-2 font-headline text-base font-bold text-slate-950">
                    <Icon name="document" className="h-5 w-5 text-blue-700" />
                    제출 서류
                  </h3>

                  <div className="space-y-3">
                    {policy.documents.map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3"
                      >
                        <span className="text-sm text-slate-700">{item}</span>
                        <Icon
                          name="download"
                          className="h-4 w-4 flex-shrink-0 text-slate-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4 rounded-[28px] border-2 border-dashed border-slate-300 bg-white/60 p-8 md:flex-row md:items-center">
                <div>
                  <h4 className="font-headline text-lg font-bold text-slate-950">
                    더 자세한 정보가 필요하신가요?
                  </h4>
                  <p className="mt-1 text-sm text-slate-600">
                    정책 상세 조건은 백엔드 데이터와 함께 계속 확장할 수
                    있습니다.
                  </p>
                </div>

                <Link
                  href="/policies"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-600 bg-white px-6 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
                >
                  추천 목록 보기
                  <Icon name="external" className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-slate-200/70 bg-slate-100/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 px-6 py-12 md:flex-row lg:px-8">
          <div className="text-center md:text-left">
            <div className="font-headline text-xl font-bold text-slate-900">
              BenefitON
            </div>
            <p className="mt-2 max-w-xs text-sm text-slate-500">
              © 2024 BenefitON. 스마트한 맞춤형 추천으로 청년 복지를
              지원합니다.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
            <a href="#" className="transition hover:text-blue-700 hover:underline">
              이용약관
            </a>
            <a href="#" className="transition hover:text-blue-700 hover:underline">
              개인정보처리방침
            </a>
            <a href="#" className="transition hover:text-blue-700 hover:underline">
              고객지원
            </a>
            <a href="#" className="transition hover:text-blue-700 hover:underline">
              회사소개
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
