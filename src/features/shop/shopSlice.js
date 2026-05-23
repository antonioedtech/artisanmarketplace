import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { firebaseConfig } from '../../services/firebaseConfig';

/**
 * Función de utilidad para normalizar strings (quita acentos, espacios y pasa a minúsculas).
 * Esto garantiza que "Cerámica" coincida con "ceramica".
 */
const normalizeString = (str) => 
  str?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";

/**
 * Thunk para obtener los productos desde Firebase Realtime Database.
 */
export const getProductsFromDb = createAsyncThunk(
  'shop/getProductsFromDb',
  async (argToken, { getState, rejectWithValue }) => {
    try {
      const token = argToken || getState().auth.token;
      if (!token) throw new Error("No hay un token de sesión válido");
      console.log("Iniciando descarga de productos desde Firebase...");
      
      // Normalizamos la URL: eliminamos espacios y barras finales
      let baseUrl = firebaseConfig.databaseURL.trim();
      if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
      }

      // La REST API de Firebase Realtime Database requiere el sufijo .json
      const url = `${baseUrl}/products.json?auth=${token}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Respuesta de Firebase no exitosa:", errorData);
        throw new Error("Error de permisos o conexión");
      }

      const data = await response.json();
      console.log("Datos brutos recibidos de Firebase:", data ? "Objeto recibido" : "null/undefined");
      
      if (!data) {
        console.warn("⚠️ El nodo 'products' no existe en la URL proporcionada.");
        return [];
      }

      // Extraemos la lista: Firebase puede devolver {products: [...]} o el array directo
      const actualData = (data.products && !Array.isArray(data)) ? data.products : data;
      const finalData = Array.isArray(actualData) ? actualData : Object.values(actualData);
      
      console.log("✅ Descarga finalizada.", finalData.length, "ítems encontrados.");
      return finalData.filter(item => item !== null); // Limpieza de posibles nulos de Firebase
    } catch (error) {
      console.error("Fallo crítico en getProductsFromDb:", error.message);
      return rejectWithValue(error.message);
    }
  },
  {
    // Evita llamadas duplicadas si ya está cargando o ya se tienen los productos
    condition: (_, { getState }) => {
      const { shop } = getState();
      if (shop.status === 'loading' || shop.products.length > 0) {
        return false;
      }
    }
  }
);

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    categorySelected: '',
    productSelected: null,
    categories: [],
    products: [],
    productsFiltered: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setCategorySelected: (state, action) => {
      state.categorySelected = action.payload;
      const categoryNormalized = normalizeString(action.payload);
      
      // Filtrado robusto (Ignora acentos y mayúsculas)
      state.productsFiltered = state.products.filter(p => 
        normalizeString(p.category) === categoryNormalized
      );
      
      console.log(`Filtrando por ${action.payload}: ${state.productsFiltered.length} coincidencias.`);
    },
    setProductSelected: (state, action) => {
      state.productSelected = action.payload;
    },
    setProductsFilteredByCategory: (state, action) => {
      state.productsFiltered = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductsFromDb.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getProductsFromDb.fulfilled, (state, action) => {
        state.status = 'success';
        const products = action.payload || [];
        state.products = products;

        // Extraemos categorías únicas de forma segura
        state.categories = [...new Set(products.map(p => p.category))];

        // Si ya hay una categoría seleccionada (ej: el usuario navegó antes de que termine el fetch)
        if (state.categorySelected) {
          const categoryNormalized = normalizeString(state.categorySelected);
          state.productsFiltered = products.filter(p => 
            normalizeString(p.category) === categoryNormalized
          );
        } else {
          state.productsFiltered = products;
        }
        console.log("Estado actualizado con", state.productsFiltered.length, "productos visibles.");
      })
      .addCase(getProductsFromDb.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

/** 
 * Exportación de acciones: Esto es lo que permite que ItemListScreen 
 * haga: import { setProductSelected } from ...
 */
export const { setCategorySelected, setProductSelected, setProductsFilteredByCategory } = shopSlice.actions;

// Exportación del reducer para el store
export default shopSlice.reducer;