import React, { useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { loadCartAsync, removeItemAsync, clearCartAsync } from '../features/cart/cartSlice';
import Loader from '../components/Loader';

const CartScreen = () => {
  const dispatch = useDispatch();
  const { items, total, totalItems, status } = useSelector((state) => state.cart);

  // Sincronización proactiva: Se monta el componente y lee de SQLite
  useEffect(() => {
    dispatch(loadCartAsync());
  }, [dispatch]);

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert("Carrito vacío", "Agrega artesanías antes de confirmar.");
      return;
    }
    Alert.alert("Compra exitosa", "Tu orden ha sido procesada.");
    dispatch(clearCartAsync());
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toLocaleString('es-AR')}</Text>
        <Text style={styles.quantity}>Cantidad: {item.quantity}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => dispatch(removeItemAsync(item.id))}
      >
        <Ionicons name="trash-outline" size={22} color="#e53935" />
      </TouchableOpacity>
    </View>
  );

  if (status === 'loading') return <Loader message="Sincronizando carrito..." />;

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={70} color="#ccc" />
            <Text style={styles.emptyText}>Tu carrito persistente está vacío</Text>
          </View>
        }
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total ítems:</Text>
          <Text style={styles.summaryValue}>{totalItems}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total a pagar:</Text>
          <Text style={styles.totalValue}>${total.toLocaleString('es-AR')}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} activeOpacity={0.8}>
          <Text style={styles.checkoutButtonText}>Proceder al Pago</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... Mantenemos los mismos estilos de StyleSheet que definimos anteriormente ...
export default CartScreen;