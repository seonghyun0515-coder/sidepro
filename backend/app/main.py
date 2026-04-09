from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import onboarding, policies, recommendations

# FastAPI 앱의 진입점입니다.
# Uvicorn은 `uvicorn app.main:app --reload` 명령으로 이 객체를 로드합니다.
app = FastAPI(
    title="BenefitON API",
    description="Backend API for the BenefitON youth policy recommendation service.",
    version="0.1.0",
)

# `localhost:3000`에서 실행 중인 Next.js 프론트엔드가 이 API를 호출할 수 있게 합니다.
# CORS 설정이 없으면 브라우저가 서로 다른 포트 간 요청을 차단합니다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 경로 패턴이 겹칠 수 있을 때는 정적 라우트를 동적 라우트보다 먼저 등록합니다.
# `/policies/recommended`가 `/policies/{policy_id}`보다 먼저 매칭되어야 합니다.
app.include_router(onboarding.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(policies.router, prefix="/api")


@app.get("/health")
def health_check() -> dict[str, str]:
    """서버가 정상 실행 중인지 확인하는 간단한 헬스 체크 엔드포인트입니다."""
    return {"status": "ok"}
