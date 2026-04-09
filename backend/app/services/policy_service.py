import json
from pathlib import Path
from typing import Any

from app.schemas.policy import PolicyDetailResponse, PolicyListItem, PolicyMetaItem

# 이 파일 기준으로 경로를 계산해 어떤 터미널 위치에서 실행해도 동작하게 합니다.
BASE_DIR = Path(__file__).resolve().parents[2]
SEED_FILE = BASE_DIR / "seed" / "policies.json"


class PolicyService:
    """
    정책 데이터를 불러오고 반환하는 역할의 서비스입니다.

    파일 입출력과 시드 데이터 처리 로직을 서비스로 분리하면
    라우트 핸들러가 커지지 않고 테스트도 쉬워집니다.
    """

    def __init__(self) -> None:
        # 시작 시점에 시드 데이터를 한 번만 불러옵니다.
        self._policies = self._load_seed()

    def _load_seed(self) -> list[dict[str, Any]]:
        """디스크에서 시드 정책 JSON을 읽어 원본 딕셔너리 목록으로 반환합니다."""
        with SEED_FILE.open("r", encoding="utf-8") as file:
            return json.load(file)

    def _find_policy(self, policy_id: str) -> dict[str, Any] | None:
        """정책 id로 원본 정책 딕셔너리 한 건을 찾습니다."""
        return next(
            (policy for policy in self._policies if policy["id"] == policy_id),
            None,
        )

    def get_raw_policies(self) -> list[dict[str, Any]]:
        """
        원본 정책 딕셔너리 목록을 반환합니다.

        이 메서드는 추천 서비스에서 사용합니다.
        추천 계산에는 공개 목록 응답에 없는 eligibility 필드가 필요하기 때문입니다.
        """
        return self._policies

    def list_policies(
        self,
        *,
        category: str | None = None,
        region_code: str | None = None,
        keyword: str | None = None,
    ) -> list[PolicyListItem]:
        """
        정책 카드 목록 페이지용 필터링된 정책 목록을 반환합니다.

        필터는 선택 사항이므로 프론트엔드는 쿼리 파라미터 없이 호출해도
        기본적으로 의미 있는 결과를 받을 수 있습니다.
        """
        filtered = self._policies

        if category:
            filtered = [policy for policy in filtered if policy["category"] == category]

        if region_code:
            filtered = [
                policy
                for policy in filtered
                if policy["region_code"] in {region_code, "NATIONAL"}
            ]

        if keyword:
            lowered = keyword.lower()
            filtered = [
                policy
                for policy in filtered
                if lowered in policy["title"].lower()
                or lowered in policy["summary"].lower()
            ]

        # 반환 전에 원본 딕셔너리를 응답 모델로 변환합니다.
        return [
            PolicyListItem(
                id=policy["id"],
                title=policy["title"],
                category=policy["category"],
                provider=policy["provider"],
                summary=policy["summary"],
                region_code=policy["region_code"],
                apply_end_date=policy["apply_end_date"],
            )
            for policy in filtered
        ]

    def get_policy_detail(self, policy_id: str) -> PolicyDetailResponse | None:
        """주어진 정책 id에 대한 전체 상세 응답을 구성합니다."""
        policy = self._find_policy(policy_id)
        if policy is None:
            return None

        return PolicyDetailResponse(
            id=policy["id"],
            title=policy["title"],
            category=policy["category"],
            provider=policy["provider"],
            summary=policy["summary"],
            region_code=policy["region_code"],
            match_score=policy["sample_match_score"],
            recommendation_reasons=policy["sample_recommendation_reasons"],
            apply_start_date=policy["apply_start_date"],
            apply_end_date=policy["apply_end_date"],
            application_method=policy["application_method"],
            documents=policy["documents"],
            ai_summary=policy["ai_summary"],
            meta_items=[PolicyMetaItem(**item) for item in policy["meta_items"]],
        )


policy_service = PolicyService()
