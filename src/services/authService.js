import { FIREBASE_AUTH_API_KEY } from './firebaseConfig'; // Extrae la API key que guardamos al inicio

const BASE_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:';

/**
 * Servicio encargado de las peticiones HTTP para Autenticación en Firebase.
 * Justificación: Aplica el principio de abstracción de red (API Wrapper).
 */
export const authService = {
  /**
   * Registro de nuevos usuarios con Email y Password.
   */
  signUp: async (email, password) => {
    const response = await fetch(`${BASE_URL}signUp?key=${FIREBASE_AUTH_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'Error en el registro');
    }
    return await response.json();
  },

  /**
   * Inicio de sesión de usuarios existentes.
   */
  signIn: async (email, password) => {
    const response = await fetch(`${BASE_URL}signInWithPassword?key=${FIREBASE_AUTH_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'Error en el inicio de sesión');
    }
    return await response.json();
  }
};