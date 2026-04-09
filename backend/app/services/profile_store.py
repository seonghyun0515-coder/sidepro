from app.schemas.onboarding import OnboardingProfile


class ProfileStore:
    """
    온보딩 프로필을 임시로 저장하는 인메모리 저장소입니다.

    존재 이유:
    - 프론트엔드와 백엔드를 빠르게 연결할 수 있습니다.
    - 데이터베이스를 너무 이르게 도입하지 않게 해줍니다.
    - MVP 단계에서는 API 흐름 검증에 집중할 수 있습니다.

    현재 한계:
    - 백엔드가 재시작되면 데이터가 사라집니다.
    - 프로필 한 건만 저장할 수 있습니다.
    """

    def __init__(self) -> None:
        self._profile: OnboardingProfile | None = None

    def save(self, profile: OnboardingProfile) -> None:
        """현재 온보딩 프로필을 저장하거나 기존 값을 덮어씁니다."""
        self._profile = profile

    def get(self) -> OnboardingProfile | None:
        """저장된 프로필이 있으면 반환합니다."""
        return self._profile


profile_store = ProfileStore()
