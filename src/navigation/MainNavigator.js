import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

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
const ShopStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#f4511e' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="Categories" 
      component={CategoriesScreen} 
      options={{ title: 'Artesanías' }} 
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

/**
 * 2. Stack de Autenticación (AuthStack)
 * Flujo aislado para usuarios no logueados.
 */
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#333' },
      headerTintColor: '#fff',
    }}
  >
    <Stack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ title: 'Iniciar Sesión' }} 
    />
    <Stack.Screen 
      name="Register" 
      component={RegisterScreen} 
      options={{ title: 'Registro de Agencia' }} 
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
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff'
        }} 
      />
      <Tab.Screen 
        name="MapTab" 
        component={MapScreen} 
        options={{ 
          title: 'Talleres',
          headerShown: true,
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff'
        }} 
      />
    </Tab.Navigator>
  );
};

/**
 * 4. Contenedor Raíz (MainNavigator)
 * Aplica el patrón de renderizado condicional según el estado de Redux Auth.
 */
const MainNavigator = () => {
  // Suscripción al estado de seguridad global
  const { token } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      {/* 
        Garantía de Aislamiento de Rutas:
        Si el token es null, no hay forma física de navegar al ShopTabNavigator,
        blindando la aplicación contra fugas de datos en el cliente.
      */}
      {token ? <ShopTabNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default MainNavigator;