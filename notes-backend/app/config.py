import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from urllib.parse import quote_plus

load_dotenv()

# URL encode the credentials
username = quote_plus("new-user-01")
password = quote_plus("Prateeka0507")
mongodb_url = f"mongodb+srv://{username}:{password}@collegebuddy.gjou4.mongodb.net/?retryWrites=true&w=majority&appName=collegebuddy"

class Settings(BaseSettings):
    # MongoDB connection settings
    MONGODB_URL: str = mongodb_url
    DATABASE_NAME: str = "collegebuddy"
    
    # JWT settings
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "n0t3s4pp$3cur3k3y2025")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    class Config:
        env_file = ".env"

settings = Settings() 