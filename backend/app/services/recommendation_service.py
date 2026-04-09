from datetime import date
from typing import Any

from app.schemas.onboarding import OnboardingProfile
from app.schemas.recommendation import RecommendationItem
from app.services.policy_service import policy_service


class RecommendationService:
    """
    MVP용 규칙 기반 추천 엔진입니다.

    먼저 규칙 기반으로 시작한 이유:
    - 동작 원리를 설명하기 쉽습니다.
    - 디버깅이 쉽습니다.
    - 작고 구조화된 시드 데이터셋에 잘 맞습니다.
    """

    def _score_policy(
        self,
        profile: OnboardingProfile,
        policy: dict[str, Any],
    ) -> tuple[int, list[str], list[str]]:
        """
        온보딩 프로필 하나에 대해 정책 하나의 점수를 계산합니다.

        반환값:
        - score: 수치화된 적합도 점수
        - matched_tags: 카드 UI에 표시할 짧은 태그
        - reasons: 사람이 읽기 쉬운 조금 더 긴 설명
        """
        score = 0
        matched_tags: list[str] = []
        reasons: list[str] = []

        eligibility = policy["eligibility"]

        if eligibility["min_age"] <= profile.age <= eligibility["max_age"]:
            score += 30
            matched_tags.append("연령 일치")
            reasons.append("연령 조건이 일치합니다.")

        if policy["region_code"] == profile.region_code:
            score += 25
            matched_tags.append("지역 일치")
            reasons.append("거주 지역 조건이 일치합니다.")
        elif policy["region_code"] == "NATIONAL":
            score += 15
            matched_tags.append("전국 공통")
            reasons.append("전국 단위 정책이라 지역 제한 없이 지원할 수 있습니다.")

        if eligibility["employment_status"] == profile.employment_status:
            score += 20
            matched_tags.append("고용 상태 부합")
            reasons.append("현재 고용 상태가 정책 대상과 맞습니다.")

        if (
            eligibility["income_brackets"]
            and profile.income_bracket in eligibility["income_brackets"]
        ):
            score += 15
            matched_tags.append("소득 조건 부합")
            reasons.append("선택한 소득 구간이 정책의 지원 범위에 포함됩니다.")

        if eligibility["student_status"] == profile.student_status:
            score += 10
            matched_tags.append("학적 조건 부합")

        if eligibility["housing_status"] == profile.housing_status:
            score += 10
            matched_tags.append("주거 조건 부합")

        # 마감이 임박한 정책에는 소폭 가산점을 부여합니다.
        days_left = (date.fromisoformat(policy["apply_end_date"]) - date.today()).days
        if days_left <= 7:
            score += 5
            matched_tags.append("마감 임박")

        # 목록 카드가 너무 길어지지 않도록 태그는 최대 두 개만 반환합니다.
        return score, matched_tags[:2], reasons

    def recommend(self, profile: OnboardingProfile) -> list[RecommendationItem]:
        """
        최소 점수를 넘는 모든 정책에 대해 추천 카드 목록을 생성합니다.

        이 응답 형식은 프론트엔드 추천 목록 페이지에 맞춰 설계되었습니다.
        """
        recommendations: list[RecommendationItem] = []

        for policy in policy_service.get_raw_policies():
            score, tags, reasons = self._score_policy(profile, policy)

            # MVP 단계에서는 점수가 낮은 약한 매칭은 제외합니다.
            if score < 40:
                continue

            deadline = date.fromisoformat(policy["apply_end_date"])
            dday = (deadline - date.today()).days

            recommendations.append(
                RecommendationItem(
                    policy_id=policy["id"],
                    category=policy["category"],
                    match_score=score,
                    title=policy["title"],
                    description=policy["summary"],
                    reason_tags=tags,
                    reason_summary=(
                        reasons[0] if reasons else "기본 조건을 충족합니다."
                    ),
                    deadline_label=f"D-{dday}" if dday >= 0 else "마감",
                    deadline_date=policy["apply_end_date"],
                    action_label="상세 보기",
                    accent=policy["accent"],
                    is_urgent=dday <= 7,
                )
            )

        # 적합도가 높은 정책부터 먼저 보여줍니다.
        recommendations.sort(key=lambda item: item.match_score, reverse=True)
        return recommendations


recommendation_service = RecommendationService()
