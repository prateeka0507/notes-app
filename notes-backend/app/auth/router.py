from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from ..database import get_user_collection
from .models import User, UserCreate, Token, UserInDB
from .utils import verify_password, get_password_hash, create_access_token
from .jwt import get_user_by_email, get_current_active_user
from ..config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    try:
        # Log registration attempt
        logger.info(f"Attempting to register user with email: {user_data.user_email}")
        
        # Check if user exists
        db_user = await get_user_by_email(user_data.user_email)
        if db_user:
            logger.warning(f"Registration failed: Email already exists - {user_data.user_email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        user_in_db = UserInDB(
            user_name=user_data.user_name,
            user_email=user_data.user_email,
            hashed_password=get_password_hash(user_data.password)
        )
        
        user_dict = user_in_db.dict()
        
        # Insert into database
        try:
            collection = await get_user_collection()
            await collection.insert_one(user_dict)
            logger.info(f"Successfully registered user: {user_data.user_email}")
        except Exception as db_error:
            logger.error(f"Database error during user registration: {str(db_error)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user account"
            )
        
        # Return the user without the password
        return User(
            user_id=user_dict["user_id"],
            user_name=user_dict["user_name"],
            user_email=user_dict["user_email"],
            created_on=user_dict["created_on"],
            last_update=user_dict["last_update"]
        )
        
    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        # Log unexpected errors
        logger.error(f"Unexpected error during registration: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during registration"
        )

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and get access token"""
    # Get user by email
    user = await get_user_by_email(form_data.username)
    
    # Check if user exists and password is correct
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["user_id"]}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/user", response_model=User)
async def get_user(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user 