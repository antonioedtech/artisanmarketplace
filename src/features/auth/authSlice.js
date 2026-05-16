import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- THUNKS ASÍNCRONOS ---

/**
 * Thunk para intentar el auto-login leyendo el hardware del dispositivo.
 * Justificación: Evita la pantalla de login si el token sigue siendo válido.
 */
export const checkPersistedAuthAsync = createAsyncThunk(
  'auth/checkPersistedAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Intentamos recuperar la sesión del almacenamiento persistente
      const persistedUserData = await AsyncStorage.getItem('@user_session');
      if (persistedUserData) {
        return JSON.parse(persistedUserData); // Retorna { token, user, uid }
      }
      return null;
    } catch (error) {
      return rejectWithValue('Error al leer la sesión del disco.');
    }
  }
);

export const signUpAsync = createAsyncThunk(
  'auth/signUpAsync',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.signUp(email, password);
      const sessionData = { token: data.idToken, user: data.email, uid: data.localId };
      
      // Persistimos en hardware antes de actualizar memoria
      await AsyncStorage.setItem('@user_session', JSON.stringify(sessionData));
      return sessionData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInAsync = createAsyncThunk(
  'auth/signInAsync',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.signIn(email, password);
      const sessionData = { token: data.idToken, user: data.email, uid: data.localId };
      
      // Persistimos en hardware antes de actualizar memoria
      await AsyncStorage.setItem('@user_session', JSON.stringify(sessionData));
      return sessionData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/** Thunk para un cierre de sesión seguro que limpie el hardware */
export const logoutAsync = createAsyncThunk(
  'auth/logoutAsync',
  async () => {
    await AsyncStorage.removeItem('@user_session');
    return null;
  }
);

// --- SLICE ---

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    uid: null,
    status: 'idle', // 'idle' | 'loading' | 'success' | 'failed'
    isCheckingPersistedAuth: true, // Flag crítico de control de arranque
    error: null,
  },
  reducers: {
    clearAuthError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // Verificación de sesión guardada
      .addCase(checkPersistedAuthAsync.pending, (state) => {
        state.isCheckingPersistedAuth = true;
      })
      .addCase(checkPersistedAuthAsync.fulfilled, (state, action) => {
        state.isCheckingPersistedAuth = false;
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.uid = action.payload.uid;
        }
      })
      .addCase(checkPersistedAuthAsync.rejected, (state) => {
        state.isCheckingPersistedAuth = false;
      })
      // Registro y Login
      .addMatcher(
        (action) => [signUpAsync.pending, signInAsync.pending].includes(action.type),
        (state) => { state.status = 'loading'; state.error = null; }
      )
      .addMatcher(
        (action) => [signUpAsync.fulfilled, signInAsync.fulfilled].includes(action.type),
        (state, action) => {
          state.status = 'success';
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.uid = action.payload.uid;
        }
      )
      .addMatcher(
        (action) => [signUpAsync.rejected, signInAsync.rejected].includes(action.type),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      )
      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.uid = null;
        state.status = 'idle';
      });
  }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;