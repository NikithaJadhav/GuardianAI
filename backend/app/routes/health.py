"""
Health Check Routes Module

This module contains health check endpoints to monitor the backend status.
"""

from fastapi import APIRouter
from typing import Dict

router = APIRouter()


@router.get("/health")
async def health_check() -> Dict[str, str]:
    """
    Health check endpoint to verify the backend is operational.
    
    Returns:
        dict: Status message indicating the backend health
    """
    return {
        "status": "healthy",
        "message": "GuardianAI Backend is running"
    }
