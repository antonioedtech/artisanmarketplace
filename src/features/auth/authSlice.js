import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

/** Thunk para el registro asíncrono */
export const signUpAsync = createAsyncThunk(
  'auth/signUpAsync',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.signUp(email, password);
      return { token: data.idToken, user: data.email, uid: data.localId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/** Thunk para el inicio de sesión asíncrono */
export const signInAsync = createAsyncThunk(
  'auth/signInAsync',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.signIn(email, password);
      return { token: data.idToken, user: data.email, uid: data.localId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,       // Email del usuario activo
    token: null,      // JWT retornado por Firebase
    uid: null,        // UID único del usuario
    status: 'idle',   // 'idle' | 'loading' | 'success' | 'failed'
    error: null,
  },
  reducers: {
    /** Cierre de sesión inmediato (Lógica puramente sincrónica) */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.uid = null;
      state.status = 'idle';
      state.error = null;
    },
    clearAuthError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // Registro
      .addCase(signUpAsync.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.status = 'success';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.uid = action.payload.uid;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Login
      .addCase(signInAsync.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(signInAsync.fulfilled, (state, action) => {
        state.status = 'success';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.uid = action.payload.uid;
      })
      .addCase(signInAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;