"use client";

import { useState } from "react";

type EmploymentStatus =
  | "FULL_TIME"
  | "PART_TIME"
  | "UNEMPLOYED"
  | "FREELANCER";

type StudentStatus = "STUDENT" | "NON_STUDENT";

type HousingStatus = "OWNER" | "RENT";

// TypeScript type은 "허용 가능한 값의 모양"을 정의합니다.
// 여기서는 소득 선택지 한 칸이 어떤 데이터를 가지는지 정리합니다.
type IncomeOption = {
  label: string;
  value: string;
  description: string;
  defaultChecked?: boolean;
};

// 반복되는 버튼/옵션은 배열로 분리해두면 JSX가 더 읽기 쉬워집니다.
const employmentOptions: Array<{ label: string; value: EmploymentStatus }> = [
  { label: "정규직", value: "FULL_TIME" },
  { label: "아르바이트/시간제", value: "PART_TIME" },
  { label: "미취업", value: "UNEMPLOYED" },
  { label: "프리랜서", value: "FREELANCER" },
];

const regionOptions = [
  "서울특별시/수도권",
  "경기도",
  "부산광역시",
  "대구광역시",
  "기타 지역",
];

const incomeOptions: IncomeOption[] = [
  { label: "0-50%", value: "LOWEST", description: "하위" },
  {
    label: "51-80%",
    value: "LOW",
    description: "중하위",
    defaultChecked: true,
  },
  { label: "81-120%", value: "MIDDLE", description: "중상위" },
  { label: "120%+", value: "HIGH", description: "상위" },
];

// 작은 UI 조각을 함수 컴포넌트로 분리해두면
// 큰 page 컴포넌트가 너무 길어지는 것을 막을 수 있습니다.
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
  const [employmentStatus, setEmploymentStatus] =
    useState<EmploymentStatus>("FULL_TIME");
  const [studentStatus, setStudentStatus] =
    useState<StudentStatus>("STUDENT");
  const [housingStatus, setHousingStatus] = useState<HousingStatus>("RENT");

  return (
    // app/onboarding/page.tsx 는 "/onboarding" 경로 페이지입니다.
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="font-headline text-2xl font-black tracking-tight text-blue-600">
            BenefitON
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              홈
            </a>
            <a
              href="#"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              맞춤 추천
            </a>
            <a
              href="#"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              마이페이지
            </a>
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

          <form className="space-y-10">
            {/* grid 클래스로 1열/2열 배치를 반응형으로 처리합니다. */}
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
                  defaultValue=""
                  className="w-full rounded-2xl border border-transparent bg-slate-100 px-4 py-4 text-slate-900 outline-none transition focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="" disabled>
                    지역을 선택하세요
                  </option>
                  {regionOptions.map((region) => (
                    <option key={region} value={region}>
                      {region}
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
                        defaultChecked={option.defaultChecked}
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

            <div className="flex flex-col items-center space-y-4 pt-8">
              <button
                type="submit"
                className="flex w-full max-w-md items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-blue-700 to-blue-500 px-6 py-5 text-xl font-extrabold text-white shadow-[0_18px_40px_-16px_rgba(37,99,235,0.55)] transition hover:scale-[0.99] hover:opacity-95"
              >
                맞춤 혜택 찾기
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
