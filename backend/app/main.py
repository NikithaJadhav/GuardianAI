"""
Main Application Module

This is the entry point for the GuardianAI FastAPI backend.
It initializes the FastAPI application, configures CORS middleware,
and provides a health check endpoint.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI application instance
app = FastAPI(
    title="GuardianAI",
    version="1.0.0",
    debug=True,
    description="GuardianAI Backend API"
)

# Configure CORS middleware
# This allows the React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/")
async def root():
    """
    Root endpoint to verify the backend is running successfully.
    
    Returns:
        dict: A message confirming the backend is operational
    """
    return {
        "message": "GuardianAI Backend Running Successfully"
    }


if __name__ == "__main__":
    import uvicorn
    
    # Run the application using Uvicorn server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
