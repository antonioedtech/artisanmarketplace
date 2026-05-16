import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { upsertCartItem, fetchCartItems, deleteCartItem, truncateCart } from '../../db/config';

// --- THUNKS ASÍNCRONOS ---

/** Thunk para cargar el carrito desde SQLite al arrancar la pantalla */
export const loadCartAsync = createAsyncThunk(
  'cart/loadCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchCartItems();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/** Thunk para agregar un ítem calculando la cantidad de forma persistente */
export const addItemAsync = createAsyncThunk(
  'cart/addItemAsync',
  async (product, { getState, rejectWithValue }) => {
    try {
      const { items } = getState().cart;
      const existingItem = items.find(item => item.id === product.id);
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      // Escribimos directamente en el almacenamiento de hardware
      await upsertCartItem(product.id, product.title, product.price, product.image, newQuantity);
      
      return { ...product, quantity: newQuantity };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/** Thunk para remover o decrementar un ítem en SQLite */
export const removeItemAsync = createAsyncThunk(
  'cart/removeItemAsync',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { items } = getState().cart;
      const existingItem = items.find(item => item.id === id);

      if (!existingItem) return id;

      if (existingItem.quantity > 1) {
        const newQuantity = existingItem.quantity - 1;
        await upsertCartItem(existingItem.id, existingItem.title, existingItem.price, existingItem.image, newQuantity);
      } else {
        await deleteCartItem(id);
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/** Thunk para limpiar todo el carrito en disco */
export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (_, { rejectWithValue }) => {
    try {
      await truncateCart();
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- SLICE ---

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    totalItems: 0,
    status: 'idle', // 'idle' | 'loading' | 'failed'
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Carga de Carrito
      .addCase(loadCartAsync.pending, (state) => { state.status = 'loading'; })
      .addCase(loadCartAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
        state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
        state.total = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      })
      // Adición de Ítem
      .addCase(addItemAsync.fulfilled, (state, action) => {
        const product = action.payload;
        const existingIndex = state.items.findIndex(item => item.id === product.id);
        
        if (existingIndex !== -1) {
          state.items[existingIndex].quantity = product.quantity;
        } else {
          state.items.push(product);
        }
        state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
        state.total = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      })
      // Remoción de Ítem
      .addCase(removeItemAsync.fulfilled, (state, action) => {
        const id = action.payload;
        const existingItem = state.items.find(item => item.id === id);
        
        if (existingItem) {
          if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
          } else {
            state.items = state.items.filter(item => item.id !== id);
          }
        }
        state.totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
        state.total = state.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      })
      // Limpieza de Carrito
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.totalItems = 0;
      });
  }
});

export default cartSlice.reducer;