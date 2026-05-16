import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchShopData } from '../../services/shopService';

// Thunk asíncrono para Firebase
export const getProductsFromDb = createAsyncThunk(
  'shop/getProductsFromDb',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchShopData();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    categories: [],
    products: [],
    loading: false,
    error: null,
    categorySelected: '',
    productsFiltered: [],
  },
  reducers: {
    setCategorySelected: (state, action) => {
      state.categorySelected = action.payload;
      state.productsFiltered = state.products.filter(
        (product) => product.category === action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductsFromDb.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductsFromDb.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        // Extraemos categorías únicas de los productos recibidos
        state.categories = [...new Set(action.payload.map(p => p.category))];
      })
      .addCase(getProductsFromDb.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCategorySelected } = shopSlice.actions;
export default shopSlice.reducer;