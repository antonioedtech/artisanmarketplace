import React, { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { checkPersistedAuthAsync, logoutAsync } from '../features/auth/authSlice'; // Importamos Thunks
import { getProductsFromDb } from '../features/shop/shopSlice'; // Acción para cargar productos
import Loader from '../components/Loader'; // Reutilizamos nuestro loader corporativo

// --- IMPORTACIÓN DE PANTALLAS ---
import CategoriesScreen from '../screens/CategoriesScreen';
import ItemListScreen from '../screens/ItemListScreen';
import ItemDetailScreen from '../screens/ItemDetailScreen';
import CartScreen from '../screens/CartScreen';
import MapScreen from '../screens/MapScreen';
import LoginScreen from '../screens/LoginScreen';       // Flujo Auth
import RegisterScreen from '../screens/RegisterScreen';  // Flujo Auth

// --- INICIALIZADORES DE NAVIGATORS ---
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * 1. Stack de la Tienda (ShopStack)
 * Gestiona el flujo lineal de descubrimiento de productos.
 */
const ShopStack = () => {
  const dispatch = useDispatch();

  return (
    <Stack.Navigator
      screenOptions={styles.headerPrimary}
    >
      <Stack.Screen 
        name="Categories" 
        component={CategoriesScreen} 
        options={{ 
          title: 'Artesanías',
          headerRight: () => (
            <Pressable 
              onPress={() => dispatch(logoutAsync())}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, marginRight: 10 })}
            >
              <Ionicons name="log-out-outline" size={24} color="white" />
            </Pressable>
          )
        }} 
      />
      <Stack.Screen 
        name="Products" 
        component={ItemListScreen} 
        options={({ route }) => ({ title: route.params?.categoryTitle || 'Productos' })} 
      />
      <Stack.Screen 
        name="ItemDetail" 
        component={ItemDetailScreen} 
        options={{ title: 'Detalle del Producto' }} 
      />
    </Stack.Navigator>
  );
};

/**
 * 2. Stack de Autenticación (AuthStack)
 * Flujo aislado para usuarios no logueados.
 */
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={styles.headerDark}
  >
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ title: 'Iniciar Sesión' }} 
    />
    <Stack.Screen 
      name="Register" 
      component={RegisterScreen} 
      options={{ title: 'Crear Cuenta' }} 
    />
  </Stack.Navigator>
);

/**
 * 3. Navegación Principal por Pestañas (TabNavigator)
 * Encapsula los módulos de la aplicación para el usuario autenticado.
 */
const ShopTabNavigator = () => {
  // Extraemos totalItems para el badge dinámico del carrito
  const totalItems = useSelector((state) => state.cart.totalItems);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'ShopTab') iconName = focused ? 'storefront' : 'storefront-outline';
          else if (route.name === 'CartTab') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'MapTab') iconName = focused ? 'map' : 'map-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#f4511e',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Ocultamos el header del Tab porque cada Stack tiene el suyo
      })}
    >
      <Tab.Screen 
        name="ShopTab" 
        component={ShopStack} 
        options={{ title: 'Tienda' }} 
      />
      <Tab.Screen 
        name="CartTab" 
        component={CartScreen} 
        options={{ 
          title: 'Carrito',
          tabBarBadge: totalItems > 0 ? totalItems : null, // UX Reactiva
          headerShown: true,
          ...styles.headerPrimary
        }} 
      />
      <Tab.Screen 
        name="MapTab" 
        component={MapScreen} 
        options={{ 
          title: 'Talleres',
          headerShown: true,
          ...styles.headerPrimary
        }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  headerPrimary: {
    headerStyle: { backgroundColor: '#f4511e' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
  },
  headerDark: {
    headerStyle: { backgroundColor: '#333' },
    headerTintColor: '#fff',
  },
});

/**
 * 4. Contenedor Raíz (MainNavigator)
 * Aplica el patrón de renderizado condicional según el estado de Redux Auth.
 */
const MainNavigator = () => {
  const dispatch = useDispatch();
  
  // Extraemos tanto el token como el estado de verificación inicial
  const { token, isCheckingPersistedAuth } = useSelector((state) => state.auth);

  // Al montar la raíz de la navegación, disparamos la lectura del chip de memoria
  useEffect(() => {
    console.log("MainNavigator montado. Iniciando verificación de sesión...");
    dispatch(checkPersistedAuthAsync());
  }, [dispatch]);

  // Una vez autenticado, disparamos la carga de productos de Firebase Realtime Database
  useEffect(() => {
    if (token) {
      dispatch(getProductsFromDb()); 
    }
  }, [token, dispatch]);

  // Si Git o el hardware móvil están leyendo el almacenamiento local, bloqueamos el árbol visual
  if (isCheckingPersistedAuth) {
    return <Loader message="ArtisanMarket: Validando acceso..." />;
  }

  return (
    <NavigationContainer>
      {token ? <ShopTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default MainNavigator;