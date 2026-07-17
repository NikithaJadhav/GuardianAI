const API_BASE_URL = 'http://127.0.0.1:8000';

export const apiService = {
  async checkBackendConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return { success: true, data: await response.json() };
      } else {
        return { success: false, error: 'Backend returned an error' };
      }
    } catch (error) {
      return { success: false, error: 'Backend Offline' };
    }
  },

  async predictEmergency(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        return { success: true, data: await response.json() };
      } else {
        return { success: false, error: 'Backend returned an error' };
      }
    } catch (error) {
      return { success: false, error: 'Backend Offline' };
    }
  },

  async getContacts() {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return { success: true, data: await response.json() };
      } else {
        return { success: false, error: 'Backend returned an error' };
      }
    } catch (error) {
      return { success: false, error: 'Backend Offline' };
    }
  },

  async createContact(contact) {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        return { success: true, data: await response.json() };
      } else {
        return { success: false, error: 'Backend returned an error' };
      }
    } catch (error) {
      return { success: false, error: 'Backend Offline' };
    }
  },

  async updateContact(contactId, contact) {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        return { success: true, data: await response.json() };
      } else {
        return { success: false, error: 'Backend returned an error' };
      }
    } catch (error) {
      return { success: false, error: 'Backend Offline' };
    }
  },

  async deleteContact(contactId) {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'Backend returned an error' };
      }
    } catch (error) {
      return { success: false, error: 'Backend Offline' };
    }
  },
};
