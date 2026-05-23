import { API_KEY } from './firebaseConfig'; // exportar API_KEY desde firebaseConfig

const BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts';

export const authService = {
  signUp: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}:signUp?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        // Extraemos el código de error de Firebase (ej: EMAIL_EXISTS)
        throw new Error(data?.error?.message || 'AUTH_UNKNOWN_ERROR');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  signIn: async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}:signInWithPassword?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || 'AUTH_UNKNOWN_ERROR');
      }
      return data;
    } catch (error) {
      throw error;
    }
  },
};