from datetime import datetime
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from uuid import uuid4, UUID

# User models
class UserBase(BaseModel):
    user_name: str
    user_email: EmailStr

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    user_id: str = Field(default_factory=lambda: str(uuid4()))
    hashed_password: str
    created_on: datetime = Field(default_factory=datetime.utcnow)
    last_update: datetime = Field(default_factory=datetime.utcnow)

class User(UserBase):
    user_id: str
    created_on: datetime
    last_update: datetime

# Token models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None 