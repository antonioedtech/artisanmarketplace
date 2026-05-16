import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Location from 'expo-location';

/**
 * Thunk asíncrono para solicitar permisos y obtener la ubicación actual.
 * Justificación: El acceso al GPS es una operación de hardware bloqueante; 
 * manejarlo en un Thunk evita congelar el hilo de la UI.
 */
export const getCurrentLocationAsync = createAsyncThunk(
  'location/getCurrentLocation',
  async (_, { rejectWithValue }) => {
    try {
      // 1. Solicitar permisos al sistema operativo
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        return rejectWithValue('Permiso de localización denegado por el usuario.');
      }

      // 2. Obtener coordenadas de alta precisión
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Error al obtener la ubicación.');
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    userLocation: null,      // Coordenadas { latitude, longitude }
    status: 'idle',          // 'idle' | 'loading' | 'success' | 'failed'
    error: null,
    // Mock de puntos de interés fijos (Locales de artesanos)
    pickupPoints: [
      { id: 1, title: "Taller Alfarería Ancestral", latitude: -34.6037, longitude: -58.3816 }, // Centro genérico
      { id: 2, title: "Tejidos del Norte", latitude: -34.6157, longitude: -58.4116 }
    ]
  },
  reducers: {
    clearLocationError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentLocationAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getCurrentLocationAsync.fulfilled, (state, action) => {
        state.status = 'success';
        state.userLocation = action.payload;
      })
      .addCase(getCurrentLocationAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearLocationError } = locationSlice.actions;
export default locationSlice.reducer;