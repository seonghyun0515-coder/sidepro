# BenefitON Backend

Minimal FastAPI backend for the BenefitON MVP.

## Run

1. Install Python 3.11+
2. Create and activate a virtual environment
3. Install dependencies

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Main endpoints

- `GET /health`
- `POST /api/profile/onboarding`
- `GET /api/profile/onboarding`
- `GET /api/policies`
- `GET /api/policies/{policy_id}`
- `GET /api/policies/recommended`
