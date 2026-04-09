from fastapi import APIRouter, HTTPException, Query

from app.schemas.policy import PolicyDetailResponse, PolicyListItem
from app.services.policy_service import policy_service

# 정책 목록/상세 조회 엔드포인트를 모아둔 라우터입니다.
router = APIRouter(tags=["policies"])


@router.get("/policies", response_model=list[PolicyListItem])
def list_policies(
    category: str | None = Query(default=None),
    region_code: str | None = Query(default=None),
    keyword: str | None = Query(default=None),
) -> list[PolicyListItem]:
    """
    정책 목록 페이지에 표시할 정책 카드 데이터를 반환합니다.

    선택적 쿼리 파라미터를 사용하면 프론트엔드가 초기에 모든 필터를
    직접 구현하지 않아도 간단한 필터링을 적용할 수 있습니다.
    """
    return policy_service.list_policies(
        category=category,
        region_code=region_code,
        keyword=keyword,
    )


@router.get("/policies/{policy_id}", response_model=PolicyDetailResponse)
def get_policy_detail(policy_id: str) -> PolicyDetailResponse:
    """단일 정책의 상세 응답 데이터를 반환합니다."""
    detail = policy_service.get_policy_detail(policy_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Policy not found")
    return detail
