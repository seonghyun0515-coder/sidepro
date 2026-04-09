from fastapi import APIRouter

from app.schemas.onboarding import OnboardingProfile
from app.services.profile_store import profile_store

# APIRouter를 사용하면 관련된 엔드포인트를 한 파일에 묶어 관리할 수 있습니다.
# 이 라우터는 온보딩/프로필 관련 동작만 담당합니다.
router = APIRouter(tags=["onboarding"])


@router.post("/profile/onboarding", response_model=OnboardingProfile)
def save_onboarding_profile(payload: OnboardingProfile) -> OnboardingProfile:
    """
    프론트엔드가 전송한 온보딩 프로필을 저장합니다.

    현재는 MVP 개발 속도를 위해 메모리에 저장합니다.
    이후에는 실제 데이터베이스 저장소로 교체할 수 있습니다.
    """
    profile_store.save(payload)
    return payload


@router.get("/profile/onboarding", response_model=OnboardingProfile | None)
def get_onboarding_profile() -> OnboardingProfile | None:
    """가장 최근에 저장된 온보딩 프로필을 반환하고, 없으면 `None`을 반환합니다."""
    return profile_store.get()
