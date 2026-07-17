"""
Contacts Routes

API endpoints for emergency contact management.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse
from app.models.contact import contact_model

router = APIRouter(prefix="/contacts", tags=["contacts"])


@router.post("", response_model=ContactResponse, status_code=201)
async def create_contact(contact: ContactCreate):
    """
    Create a new emergency contact.
    
    Args:
        contact: Contact data to create
        
    Returns:
        Created contact with ID and timestamps
    """
    try:
        created_contact = contact_model.create(contact.model_dump())
        return ContactResponse(**created_contact)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create contact: {str(e)}")


@router.get("", response_model=List[ContactResponse])
async def get_contacts():
    """
    Get all emergency contacts.
    
    Returns:
        List of all contacts
    """
    try:
        contacts = contact_model.get_all()
        return [ContactResponse(**contact) for contact in contacts]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve contacts: {str(e)}")


@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(contact_id: str):
    """
    Get a specific contact by ID.
    
    Args:
        contact_id: Contact ID
        
    Returns:
        Contact if found
    """
    contact = contact_model.get_by_id(contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return ContactResponse(**contact)


@router.put("/{contact_id}", response_model=ContactResponse)
async def update_contact(contact_id: str, contact_update: ContactUpdate):
    """
    Update an existing contact.
    
    Args:
        contact_id: Contact ID
        contact_update: Fields to update
        
    Returns:
        Updated contact
    """
    # Filter out None values
    update_data = {k: v for k, v in contact_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")
    
    updated_contact = contact_model.update(contact_id, update_data)
    if not updated_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    return ContactResponse(**updated_contact)


@router.delete("/{contact_id}", status_code=204)
async def delete_contact(contact_id: str):
    """
    Delete a contact.
    
    Args:
        contact_id: Contact ID
        
    Returns:
        No content on success
    """
    deleted = contact_model.delete(contact_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Contact not found")
    return None
