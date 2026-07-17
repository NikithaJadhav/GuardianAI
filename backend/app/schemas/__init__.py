"""
Schemas Package

This package contains Pydantic schemas for request/response validation.
Schemas define the structure of data exchanged via API endpoints.
"""

from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse
from app.schemas.alert import AlertCreate, AlertResponse
from app.schemas.sensor import SensorData

__all__ = ['ContactCreate', 'ContactUpdate', 'ContactResponse', 'AlertCreate', 'AlertResponse', 'SensorData']
