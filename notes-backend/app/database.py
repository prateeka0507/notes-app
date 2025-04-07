from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import settings
import logging
from typing import Optional

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database client and collections
client: Optional[AsyncIOMotorClient] = None
db: Optional[AsyncIOMotorDatabase] = None
user_collection = None
note_collection = None

async def get_database():
    if db is None:
        await connect_to_mongo()
    return db

async def get_user_collection():
    if user_collection is None:
        await connect_to_mongo()
    return user_collection

async def get_note_collection():
    if note_collection is None:
        await connect_to_mongo()
    return note_collection

async def connect_to_mongo():
    """Connect to MongoDB"""
    global client, db, user_collection, note_collection
    
    if client is not None:
        return  # Already connected
    
    try:
        # Create a connection to MongoDB
        logger.info(f"Connecting to MongoDB at {settings.MONGODB_URL}")
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        
        # Test the connection
        await client.admin.command('ping')
        logger.info("MongoDB connection successful!")
        
        # Connect to existing database
        db = client[settings.DATABASE_NAME]
        logger.info(f"Connected to database: {settings.DATABASE_NAME}")
        
        # Get existing collections
        user_collection = db.users
        note_collection = db.notes
        logger.info("Connected to existing collections: users, notes")
        
    except Exception as e:
        logger.error(f"MongoDB connection error: {str(e)}")
        raise Exception(f"Failed to connect to MongoDB: {str(e)}")

async def close_mongo_connection():
    """Close MongoDB connection"""
    global client, db, user_collection, note_collection
    if client is not None:
        client.close()
        client = None
        db = None
        user_collection = None
        note_collection = None
        logger.info("MongoDB connection closed.") 