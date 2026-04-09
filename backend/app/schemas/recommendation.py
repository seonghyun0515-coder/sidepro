from typing import Literal

from pydantic import BaseModel


class RecommendationItem(BaseModel):
    """추천 목록 페이지에서 사용하는 카드형 응답 모델입니다."""

    policy_id: str
    category: Literal["HOUSING", "EMPLOYMENT", "LIVING", "EDUCATION"]
    match_score: int
    title: str
    description: str
    reason_tags: list[str]
    reason_summary: str
    deadline_label: str
    deadline_date: str
    action_label: str
    accent: Literal["blue", "amber"]
    is_urgent: bool
