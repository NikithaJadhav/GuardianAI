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


# Predict endpoint for emergency detection
@app.post("/predict")
async def predict_emergency(data: dict):
    """
    Mock endpoint for emergency detection prediction.
    
    This endpoint accepts sensor data and accessibility profile information,
    then returns a mock emergency confidence score and risk level.
    
    Args:
        data: Dictionary containing sensor values and profile information
        
    Returns:
        dict: Emergency confidence score and risk level
    """
    # Mock response - will be replaced with actual ML model later
    import random
    
    # Generate a mock confidence score based on input values
    accelerometer = data.get("accelerometer", 0)
    gyroscope = data.get("gyroscope", 0)
    gps_speed = data.get("gps_speed", 0)
    inactivity_time = data.get("inactivity_time", 0)
    
    # Simple mock logic: higher values = higher emergency risk
    base_score = (accelerometer + gyroscope + (gps_speed / 1.5) + (inactivity_time * 2)) / 4
    confidence_score = min(100, max(0, base_score + random.uniform(-10, 10)))
    
    # Determine risk level based on confidence score
    if confidence_score < 25:
        risk_level = "Normal"
        risk_emoji = "🟢"
    elif confidence_score < 50:
        risk_level = "Monitor"
        risk_emoji = "🟡"
    elif confidence_score < 75:
        risk_level = "Warning"
        risk_emoji = "🟠"
    else:
        risk_level = "Emergency"
        risk_emoji = "🔴"
    
    return {
        "confidence_score": round(confidence_score, 2),
        "risk_level": risk_level,
        "risk_emoji": risk_emoji
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
