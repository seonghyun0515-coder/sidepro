from fastapi import APIRouter, HTTPException

from app.schemas.recommendation import RecommendationItem
from app.services.profile_store import profile_store
from app.services.recommendation_service import recommendation_service

# 추천 엔드포인트는 사용자의 온보딩 프로필에 의존하므로
# 일반 정책 조회 엔드포인트와 분리해 두었습니다.
router = APIRouter(tags=["recommendations"])


@router.get("/policies/recommended", response_model=list[RecommendationItem])
def get_recommended_policies() -> list[RecommendationItem]:
    """
    현재 저장된 온보딩 프로필 기준의 추천 정책 카드 목록을 반환합니다.

    프로필이 아직 없으면 프론트엔드는 추천 목록을 렌더링하기 전에
    사용자를 온보딩 흐름으로 먼저 안내해야 합니다.
    """
    profile = profile_store.get()
    if profile is None:
        raise HTTPException(
            status_code=400,
            detail="Onboarding profile is required before requesting recommendations",
        )

    return recommendation_service.recommend(profile)
