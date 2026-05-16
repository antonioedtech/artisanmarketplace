import { configureStore } from '@reduxjs/toolkit';
import shopReducer from '../features/shop/shopSlice';
import cartReducer from '../features/cart/cartSlice';
import locationReducer from '../features/location/locationSlice';
import authReducer from '../features/auth/authSlice';

const store = configureStore({
  reducer: {
    shop: shopReducer,
    cart: cartReducer,
    location: locationReducer,
    auth: authReducer,
  },
  // Middleware configurado por defecto (incluye thunk para llamadas asíncronas)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Útil cuando manejamos datos complejos de Firebase o SQLite
    }),
});

export default store;