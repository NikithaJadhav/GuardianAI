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
};
