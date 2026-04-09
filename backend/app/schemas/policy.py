from typing import Literal

from pydantic import BaseModel

# 정책 목록/상세 응답 전반에서 공통으로 사용하는 정책 카테고리 타입입니다.
Category = Literal["HOUSING", "EMPLOYMENT", "LIVING", "EDUCATION"]


class PolicyListItem(BaseModel):
    """정책 목록 페이지에서 사용하는 축약형 응답 모델입니다."""

    id: str
    title: str
    category: Category
    provider: str
    summary: str
    region_code: str
    apply_end_date: str


class PolicyMetaItem(BaseModel):
    """정책 상세 요약 영역에 표시되는 작은 라벨/값 쌍입니다."""

    label: str
    value: str
    icon: Literal["location", "payments"]


class PolicyDetailResponse(BaseModel):
    """정책 상세 페이지에서 사용하는 전체 응답 모델입니다."""

    id: str
    title: str
    category: Category
    provider: str
    summary: str
    region_code: str
    match_score: int
    recommendation_reasons: list[str]
    apply_start_date: str
    apply_end_date: str
    application_method: str
    documents: list[str]
    ai_summary: str
    meta_items: list[PolicyMetaItem]
