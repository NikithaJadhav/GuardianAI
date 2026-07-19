"""
Main Application Module

This is the entry point for the GuardianAI FastAPI backend.
It initializes the FastAPI application, configures CORS middleware,
and provides a health check endpoint.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import contacts
from app.schemas.prediction import PredictionRequest, NotifyRequest
from app.services.alert_generator import alert_generator
from app.services.notification_service import notification_service

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

# Include routers
app.include_router(contacts.router)


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
async def predict_emergency(request: PredictionRequest):
    """
    Emergency detection prediction endpoint.
    
    This endpoint accepts sensor data and accessibility profile information,
    then uses the rule-based emergency intelligence engine to analyze
    the data and return emergency confidence score and risk level.
    
    Args:
        request: Validated sensor values and profile information.
        
    Returns:
        dict: Emergency confidence score, risk level, and analysis reasons
    """
    from app.services.emergency_engine import emergency_engine
    
    data = request.model_dump()
    
    try:
        # Use the emergency intelligence engine to analyze the data
        analysis_result = emergency_engine.analyze(data)
        
        # Generate alert if confidence exceeds threshold
        alert = None
        if analysis_result['confidence'] >= 90:
            alert = alert_generator.generate_alert(
                confidence_score=analysis_result['confidence'],
                risk_level=analysis_result['risk_level'],
                reasons=analysis_result['reasons'],
                user_location=request.user_location,
                user_address=request.user_address,
                gps_latitude=request.gps_latitude,
                gps_longitude=request.gps_longitude
            )
        
        # Map to frontend-compatible format
        response = {
            "confidence_score": analysis_result['confidence'],
            "risk_level": analysis_result['risk_level'],
            "risk_emoji": analysis_result['risk_emoji'],
            "reasons": analysis_result['reasons']
        }
        
        # Include alert if generated
        if alert:
            response['alert'] = {
                'id': alert['id'],
                'emergency_status': alert['emergency_status'],
                'formatted_message': alert['formatted_message'],
                'timestamp': alert['timestamp'].isoformat(),
                'google_maps_link': alert.get('google_maps_link')
            }
        
        return response
    except Exception as e:
        # Handle any errors gracefully
        return {
            "error": f"Analysis failed: {str(e)}",
            "confidence_score": 0,
            "risk_level": "Normal",
            "risk_emoji": "🟢"
        }


# Notify contacts endpoint for emergency alerts
@app.post("/notify")
async def notify_contacts(request: NotifyRequest):
    """
    Notify emergency contacts about an alert.
    
    This endpoint triggers notifications to all registered emergency contacts
    for a given alert ID.
    
    Args:
        request: Validated payload containing the alert_id to notify contacts about.
        
    Returns:
        dict: Notification results for each contact
    """
    try:
        notification_result = notification_service.notify_contacts(request.alert_id)
        return notification_result
    except Exception as e:
        return {
            "error": f"Notification failed: {str(e)}",
            "success": False
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
