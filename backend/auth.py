from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import os
import hashlib
from . import schemas

SECRET_KEY = "super_secret_lando" # In production, use os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Hardcoded admin credentials — override with environment variables in production
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "purvathorat38@gmail.com")
_RAW_PASSWORD = os.getenv("ADMIN_PASSWORD", "LandoNorris2026")
# Pre-hash with sha256 to avoid bcrypt 72-byte limit issues with passlib
ADMIN_PASSWORD_HASH = pwd_context.hash(hashlib.sha256(_RAW_PASSWORD.encode()).hexdigest())

def verify_password(plain_password, hashed_password):
    prehashed = hashlib.sha256(plain_password.encode()).hexdigest()
    return pwd_context.verify(prehashed, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    if token_data.email != ADMIN_EMAIL:
        raise credentials_exception
        
    return token_data
