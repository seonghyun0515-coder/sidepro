from typing import Literal

from pydantic import BaseModel, Field

# `Literal`은 enum과 비슷한 문자열 선택지를 가볍게 정의하는 방법입니다.
# 입력값 검증과 에디터 자동완성에 모두 도움이 됩니다.
EmploymentStatus = Literal["FULL_TIME", "PART_TIME", "UNEMPLOYED", "FREELANCER"]
StudentStatus = Literal["STUDENT", "NON_STUDENT"]
HousingStatus = Literal["OWNER", "RENT"]
IncomeBracket = Literal["LOWEST", "LOW", "MIDDLE", "HIGH"]


class OnboardingProfile(BaseModel):
    """
    온보딩 입력과 출력에 사용하는 스키마입니다.

    Pydantic은 요청 JSON을 이 모델 기준으로 자동 검증합니다.
    즉, 잘못된 값이나 누락된 필드는 라우트 로직이 실행되기 전에 차단됩니다.
    """

    # `Field(...)`는 기본 타입 값에 검증 제약 조건을 추가합니다.
    age: int = Field(ge=18, le=39)
    region_code: str
    employment_status: EmploymentStatus
    student_status: StudentStatus
    housing_status: HousingStatus
    income_bracket: IncomeBracket
