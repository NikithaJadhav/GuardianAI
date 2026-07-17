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
    Emergency detection prediction endpoint.
    
    This endpoint accepts sensor data and accessibility profile information,
    then uses the rule-based emergency intelligence engine to analyze
    the data and return emergency confidence score and risk level.
    
    Args:
        data: Dictionary containing sensor values and profile information:
            - accelerometer: float (0-100)
            - gyroscope: float (0-100)
            - gps_speed: float (km/h)
            - inactivity_time: float (minutes)
            - screen_status: str ('Active' or 'Locked')
            - accessibility_profile: str (optional)
        
    Returns:
        dict: Emergency confidence score, risk level, and analysis reasons
    """
    from app.services.emergency_engine import emergency_engine
    
    # Validate required fields
    required_fields = ['accelerometer', 'gyroscope', 'gps_speed', 'inactivity_time', 'screen_status']
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return {
            "error": f"Missing required fields: {', '.join(missing_fields)}",
            "confidence_score": 0,
            "risk_level": "Normal",
            "risk_emoji": "🟢"
        }
    
    try:
        # Use the emergency intelligence engine to analyze the data
        analysis_result = emergency_engine.analyze(data)
        
        # Map to frontend-compatible format
        return {
            "confidence_score": analysis_result['confidence'],
            "risk_level": analysis_result['risk_level'],
            "risk_emoji": analysis_result['risk_emoji'],
            "reasons": analysis_result['reasons']
        }
    except Exception as e:
        # Handle any errors gracefully
        return {
            "error": f"Analysis failed: {str(e)}",
            "confidence_score": 0,
            "risk_level": "Normal",
            "risk_emoji": "🟢"
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
