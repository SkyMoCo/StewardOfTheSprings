from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os

router = APIRouter(prefix="/api/admin", tags=["admin"])

ADMIN_USER = os.environ.get("ADMIN_USER", "admin")
ADMIN_PASS = os.environ.get("ADMIN_PASSWORD", "changeme")

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    username: str

@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest):
    if data.username != ADMIN_USER or data.password != ADMIN_PASS:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # Simple token: in production replace with JWT
    import hashlib, time
    token = hashlib.sha256(f"{data.username}{time.time()}{os.environ.get('SECRET_KEY','')}".encode()).hexdigest()
    return {"token": token, "username": data.username}
