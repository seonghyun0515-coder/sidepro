"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { apiUrl } from "../lib/api";

type EmploymentStatus =
  | "FULL_TIME"
  | "PART_TIME"
  | "UNEMPLOYED"
  | "FREELANCER";

type StudentStatus = "STUDENT" | "NON_STUDENT";

type HousingStatus = "OWNER" | "RENT";
type IncomeBracket = "LOWEST" | "LOW" | "MIDDLE" | "HIGH";

type OnboardingProfile = {
  age: number;
  region_code: string;
  employment_status: EmploymentStatus;
  student_status: StudentStatus;
  housing_status: HousingStatus;
  income_bracket: IncomeBracket;
};

type IncomeOption = {
  label: string;
  value: IncomeBracket;
  description: string;
};

const employmentOptions: Array<{ label: string; value: EmploymentStatus }> = [
  { label: "정규직", value: "FULL_TIME" },
  { label: "아르바이트/시간제", value: "PART_TIME" },
  { label: "미취업", value: "UNEMPLOYED" },
  { label: "프리랜서", value: "FREELANCER" },
];

const regionOptions = [
  { label: "충청남도 천안시", value: "CHUNGNAM_CHEONAN" },
  { label: "전국 공통", value: "NATIONAL" },
];

const incomeOptions: IncomeOption[] = [
  { label: "0-50%", value: "LOWEST", description: "하위" },
  { label: "51-80%", value: "LOW", description: "중하위" },
  { label: "81-120%", value: "MIDDLE", description: "중상위" },
  { label: "120%+", value: "HIGH", description: "상위" },
];

function IconButton({
  label,
  symbol,
}: {
  label: string;
  symbol: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
    >
      <span aria-hidden="true" className="text-xl">
        {symbol}
      </span>
    </button>
  );
}

function ToggleButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg py-3 text-sm font-semibold transition ${
        active
          ? "bg-white text-blue-600 shadow-sm"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {label}
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [regionCode, setRegionCode] = useState(regionOptions[0].value);
  const [employmentStatus, setEmploymentStatus] =
    useState<EmploymentStatus>("UNEMPLOYED");
  const [studentStatus, setStudentStatus] =
    useState<StudentStatus>("NON_STUDENT");
  const [housingStatus, setHousingStatus] = useState<HousingStatus>("RENT");
  const [incomeBracket, setIncomeBracket] = useState<IncomeBracket>("LOW");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch(apiUrl("/profile/onboarding"));
        if (!response.ok) {
          throw new Error("온보딩 정보를 불러오지 못했습니다.");
        }

        const profile = (await response.json()) as OnboardingProfile | null;
        if (!profile || cancelled) {
          return;
        }

        setAge(String(profile.age));
        setRegionCode(profile.region_code);
        setEmploymentStatus(profile.employment_status);
        setStudentStatus(profile.student_status);
        setHousingStatus(profile.housing_status);
        setIncomeBracket(profile.income_bracket);
      } catch {
        if (!cancelled) {
          setErrorMessage("저장된 온보딩 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge)) {
      setErrorMessage("나이는 숫자로 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(apiUrl("/profile/onboarding"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          age: parsedAge,
          region_code: regionCode,
          employment_status: employmentStatus,
          student_status: studentStatus,
          housing_status: housingStatus,
          income_bracket: incomeBracket,
        } satisfies OnboardingProfile),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as
          | { detail?: string }
          | null;
        throw new Error(errorPayload?.detail ?? "온보딩 저장에 실패했습니다.");
      }

      router.push("/policies");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "온보딩 저장에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="font-headline text-2xl font-black tracking-tight text-blue-600">
            BenefitON
          </div>

          <nav className="hidden items-center gap-8 md:flex">
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
          </nav>

          <div className="flex items-center gap-3">
            <IconButton label="알림" symbol="🔔" />
            <IconButton label="설정" symbol="⚙" />
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-sm font-bold text-slate-600 shadow-sm">
              SH
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-4xl rounded-[32px] bg-white p-8 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.18)] md:p-12">
          <div className="mb-12 text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-slate-950">
              온보딩 (정보 입력)
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-8 text-slate-600">
              개인화된 복지 경험을 위해 정보를 입력해 주세요. 귀하의
              데이터는 최적의 정부 혜택을 매칭하는 데 사용됩니다.
            </p>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
              <div className="space-y-3">
                <label
                  htmlFor="age"
                  className="ml-1 text-sm font-semibold text-slate-600"
                >
                  나이
                </label>
                <div className="relative">
                  <input
                    id="age"
                    type="number"
                    min={18}
                    max={39}
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                    placeholder="나이를 입력하세요"
                    className="w-full rounded-2xl border border-transparent bg-slate-100 px-4 py-4 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-500/30"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                    세
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="region"
                  className="ml-1 text-sm font-semibold text-slate-600"
                >
                  거주 지역
                </label>
                <select
                  id="region"
                  value={regionCode}
                  onChange={(event) => setRegionCode(event.target.value)}
                  className="w-full rounded-2xl border border-transparent bg-slate-100 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-500/30"
                >
                  {regionOptions.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 md:col-span-2">
                <span className="ml-1 block text-sm font-semibold text-slate-600">
                  취업 상태
                </span>
                <div className="flex flex-wrap gap-3">
                  {employmentOptions.map((option) => {
                    const isActive = employmentStatus === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setEmploymentStatus(option.value)}
                        className={`rounded-full border-2 px-6 py-3 text-sm transition ${
                          isActive
                            ? "border-transparent bg-blue-600 font-bold text-white"
                            : "border-transparent bg-slate-100 font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <span className="ml-1 block text-sm font-semibold text-slate-600">
                  학적 상태
                </span>
                <div className="flex rounded-2xl bg-slate-100 p-1">
                  <ToggleButton
                    label="학생"
                    active={studentStatus === "STUDENT"}
                    onClick={() => setStudentStatus("STUDENT")}
                  />
                  <ToggleButton
                    label="비학생"
                    active={studentStatus === "NON_STUDENT"}
                    onClick={() => setStudentStatus("NON_STUDENT")}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <span className="ml-1 block text-sm font-semibold text-slate-600">
                  주거 형태
                </span>
                <div className="flex rounded-2xl bg-slate-100 p-1">
                  <ToggleButton
                    label="자가"
                    active={housingStatus === "OWNER"}
                    onClick={() => setHousingStatus("OWNER")}
                  />
                  <ToggleButton
                    label="임차(전/월세)"
                    active={housingStatus === "RENT"}
                    onClick={() => setHousingStatus("RENT")}
                  />
                </div>
              </div>

              <div className="space-y-4 md:col-span-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <label className="ml-1 text-sm font-semibold text-slate-600">
                    소득 구간 (백분위)
                  </label>
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
                  >
                    <span aria-hidden="true">⌗</span>
                    소득 계산기
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {incomeOptions.map((option) => (
                    <label key={option.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="income"
                        value={option.value}
                        checked={incomeBracket === option.value}
                        onChange={() => setIncomeBracket(option.value)}
                        className="peer sr-only"
                      />
                      <div className="rounded-3xl bg-slate-100 p-4 text-center transition peer-checked:bg-blue-600 peer-checked:text-white peer-checked:ring-2 peer-checked:ring-blue-300">
                        <div className="text-lg font-black">{option.label}</div>
                        <div className="text-xs opacity-75">
                          {option.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {(errorMessage || isLoadingProfile) && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {isLoadingProfile
                  ? "저장된 정보를 확인하는 중입니다..."
                  : errorMessage}
              </div>
            )}

            <div className="flex flex-col items-center space-y-4 pt-8">
              <button
                type="submit"
                disabled={isSubmitting || isLoadingProfile}
                className="flex w-full max-w-md items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-blue-700 to-blue-500 px-6 py-5 text-xl font-extrabold text-white shadow-[0_18px_40px_-16px_rgba(37,99,235,0.55)] transition hover:scale-[0.99] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "저장 중..." : "맞춤 혜택 찾기"}
                <span aria-hidden="true">→</span>
              </button>
              <p className="text-center text-xs text-slate-500">
                진행하시면 혜택 매칭을 위한 정보 처리에 동의하는 것으로
                간주됩니다.
              </p>
            </div>
          </form>
        </div>
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-slate-100/80">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-8 px-6 py-10 md:flex-row lg:px-8">
          <div className="flex flex-col items-center space-y-2 text-center md:items-start md:text-left">
            <span className="font-headline text-xl font-bold text-slate-900">
              BenefitON
            </span>
            <p className="text-sm text-slate-500">
              © 2024 BenefitON. 스마트한 맞춤 추천을 통한 청년 복지 증진.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm uppercase tracking-[0.16em] text-slate-500">
            <a href="#" className="transition hover:text-blue-600 hover:underline">
              이용약관
            </a>
            <a href="#" className="transition hover:text-blue-600 hover:underline">
              개인정보처리방침
            </a>
            <a href="#" className="transition hover:text-blue-600 hover:underline">
              고객 지원
            </a>
            <a href="#" className="transition hover:text-blue-600 hover:underline">
              서비스 소개
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
