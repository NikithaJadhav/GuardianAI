"""
Configuration Settings Module

This module handles all application configuration using Pydantic Settings.
It loads environment variables from .env file and provides type-safe configuration access.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """
    Application Settings Class
    
    Attributes:
        APP_NAME: Name of the application
        APP_VERSION: Current version of the application
        DEBUG: Debug mode flag
        HOST: Server host address
        PORT: Server port number
        CORS_ORIGINS: List of allowed CORS origins
    """
    
    # Application Information
    APP_NAME: str = "GuardianAI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000"
    ]
    
    class Config:
        """
        Pydantic configuration class
        """
        env_file = ".env"
        case_sensitive = True


# Create a global settings instance
settings = Settings()
