import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserContacts, createContact, updateContact, deleteContact } from '../firebase/firebaseService';
import './EmergencyContacts.css';

const EmergencyContacts = ({ navigateTo }) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    relationship: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  const loadContacts = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    const response = await getUserContacts(user.uid);
    setLoading(false);

    if (response.success) {
      setContacts(response.data);
    } else {
      setError(response.error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    let response;
    if (editingContact) {
      response = await updateContact(editingContact.id, formData);
    } else {
      response = await createContact(user.uid, formData);
    }

    if (response.success) {
      setShowModal(false);
      setEditingContact(null);
      setFormData({ name: '', phone_number: '', relationship: '', email: '' });
      loadContacts();
    } else {
      setError(response.error);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone_number: contact.phone_number,
      relationship: contact.relationship,
      email: contact.email || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    const response = await deleteContact(contactId);
    if (response.success) {
      loadContacts();
    } else {
      setError(response.error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingContact(null);
    setFormData({ name: '', phone_number: '', relationship: '', email: '' });
    setError(null);
  };

  return (
    <div className="emergency-contacts">
      <div className="contacts-container">
        <button 
          className="back-button"
          onClick={() => navigateTo('home')}
        >
          ← Back to Home
        </button>
        
        <div className="contacts-header">
          <h1 className="contacts-title">Emergency Contacts</h1>
          <p className="contacts-subtitle">Manage your emergency contacts for quick notification</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="contacts-content">
          <div className="contacts-list-section">
            <div className="contacts-actions">
              <button
                className="add-contact-button"
                onClick={() => setShowModal(true)}
              >
                + Add Contact
              </button>
            </div>

            {loading ? (
              <div className="loading-message">Loading contacts...</div>
            ) : contacts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📱</div>
                <h3>No Emergency Contacts</h3>
                <p>Add your first emergency contact to get started</p>
              </div>
            ) : (
              <div className="contacts-grid">
                {contacts.map(contact => (
                  <div key={contact.id} className="contact-card">
                    <div className="contact-header">
                      <div className="contact-avatar">
                        {contact.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="contact-info">
                        <h3 className="contact-name">{contact.name}</h3>
                        <span className="contact-relationship">{contact.relationship}</span>
                      </div>
                    </div>
                    
                    <div className="contact-details">
                      <div className="contact-detail">
                        <span className="detail-icon">📞</span>
                        <span className="detail-text">{contact.phone_number}</span>
                      </div>
                      {contact.email && (
                        <div className="contact-detail">
                          <span className="detail-icon">✉️</span>
                          <span className="detail-text">{contact.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="contact-actions">
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(contact)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(contact.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingContact ? 'Edit Contact' : 'Add Emergency Contact'}</h2>
              <button className="close-button" onClick={handleCloseModal}>×</button>
            </div>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="Contact name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="Phone number"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relationship *</label>
                <input
                  type="text"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                  placeholder="e.g., Spouse, Parent, Friend"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Email address"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  {editingContact ? 'Update Contact' : 'Add Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyContacts;
