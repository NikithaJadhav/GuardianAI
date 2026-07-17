"""
Contact Schemas

Pydantic schemas for emergency contact request/response validation.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class ContactBase(BaseModel):
    """Base contact schema with common fields."""
    name: str = Field(..., min_length=1, max_length=100, description="Contact name")
    phone_number: str = Field(..., min_length=10, max_length=20, description="Contact phone number")
    relationship: str = Field(..., min_length=1, max_length=50, description="Relationship to user")
    email: Optional[EmailStr] = Field(None, description="Contact email (optional)")


class ContactCreate(ContactBase):
    """Schema for creating a new contact."""
    pass


class ContactUpdate(BaseModel):
    """Schema for updating an existing contact."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone_number: Optional[str] = Field(None, min_length=10, max_length=20)
    relationship: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[EmailStr] = None


class ContactResponse(ContactBase):
    """Schema for contact response."""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
