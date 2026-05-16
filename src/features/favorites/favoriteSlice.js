import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { insertFavorite } from '../../db/config';

/**
 * Thunk para persistir en SQLite y luego actualizar el estado global.
 * Justificación: Mantiene la UI sincronizada con la base de datos real.
 */
export const addFavoriteAsync = createAsyncThunk(
  'favorites/addFavoriteAsync',
  async (product, { rejectWithValue }) => {
    try {
      await insertFavorite(product.title, product.price, product.imageUri);
      return product; // Se envía al extraReducer
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addFavoriteAsync.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addFavoriteAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default favoriteSlice.reducer;