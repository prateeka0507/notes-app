from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .database import connect_to_mongo, close_mongo_connection, get_user_collection
from .auth.router import router as auth_router
from .notes.router import router as notes_router
import uvicorn

# Create FastAPI app
app = FastAPI(
    title="Notes App API",
    description="API for Notes App with user authentication",
    version="1.0.0"
)

# Set up CORS middleware with more specific configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Specifically allow your Next.js frontend
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

# Events for database connection
@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(notes_router)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Notes App API"}

@app.get("/api/test-db")
async def test_db():
    """Test database connection"""
    try:
        collection = await get_user_collection()
        result = await collection.find_one()
        return {
            "status": "success",
            "message": "Database connection successful",
            "sample_data": str(result) if result else "No users found"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Database connection failed: {str(e)}"
        }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 