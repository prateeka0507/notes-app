from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from ..config import settings
from ..database import get_user_collection
from .models import TokenData, User
from typing import Optional
from datetime import datetime

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

async def get_user_by_email(email: str) -> Optional[dict]:
    """Get a user by email from the database"""
    collection = await get_user_collection()
    user = await collection.find_one({"user_email": email})
    return user

async def get_user_by_id(user_id: str) -> Optional[dict]:
    """Get a user by id from the database"""
    collection = await get_user_collection()
    user = await collection.find_one({"user_id": user_id})
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get the current user from the JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the JWT token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
        
        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception
    
    # Get the user from the database
    user = await get_user_by_id(token_data.user_id)
    
    if user is None:
        raise credentials_exception
    
    return user

# Dependency to get the current active user
async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    return User(
        user_id=current_user["user_id"],
        user_name=current_user["user_name"],
        user_email=current_user["user_email"],
        created_on=current_user["created_on"],
        last_update=current_user["last_update"]
    ) 