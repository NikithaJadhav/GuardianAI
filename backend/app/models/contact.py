"""
Contact Model

In-memory storage for emergency contacts.
Will be replaced with Firebase when database is integrated.
"""

from typing import List, Dict, Optional
from datetime import datetime
import uuid


class ContactModel:
    """
    In-memory contact storage model.
    Simulates database operations for emergency contacts.
    """
    
    def __init__(self):
        """Initialize in-memory contact storage."""
        self._contacts: Dict[str, dict] = {}
    
    def create(self, contact_data: dict) -> dict:
        """
        Create a new contact.
        
        Args:
            contact_data: Dictionary containing contact information
            
        Returns:
            Created contact with ID and timestamps
        """
        contact_id = str(uuid.uuid4())
        now = datetime.utcnow()
        
        contact = {
            "id": contact_id,
            "name": contact_data["name"],
            "phone_number": contact_data["phone_number"],
            "relationship": contact_data["relationship"],
            "email": contact_data.get("email"),
            "created_at": now,
            "updated_at": now
        }
        
        self._contacts[contact_id] = contact
        return contact
    
    def get_all(self) -> List[dict]:
        """
        Get all contacts.
        
        Returns:
            List of all contacts
        """
        return list(self._contacts.values())
    
    def get_by_id(self, contact_id: str) -> Optional[dict]:
        """
        Get a contact by ID.
        
        Args:
            contact_id: Contact ID
            
        Returns:
            Contact if found, None otherwise
        """
        return self._contacts.get(contact_id)
    
    def update(self, contact_id: str, update_data: dict) -> Optional[dict]:
        """
        Update an existing contact.
        
        Args:
            contact_id: Contact ID
            update_data: Dictionary containing fields to update
            
        Returns:
            Updated contact if found, None otherwise
        """
        if contact_id not in self._contacts:
            return None
        
        contact = self._contacts[contact_id]
        
        # Update provided fields
        if "name" in update_data:
            contact["name"] = update_data["name"]
        if "phone_number" in update_data:
            contact["phone_number"] = update_data["phone_number"]
        if "relationship" in update_data:
            contact["relationship"] = update_data["relationship"]
        if "email" in update_data:
            contact["email"] = update_data["email"]
        
        contact["updated_at"] = datetime.utcnow()
        
        return contact
    
    def delete(self, contact_id: str) -> bool:
        """
        Delete a contact.
        
        Args:
            contact_id: Contact ID
            
        Returns:
            True if deleted, False if not found
        """
        if contact_id in self._contacts:
            del self._contacts[contact_id]
            return True
        return False


# Singleton instance
contact_model = ContactModel()
