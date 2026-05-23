import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setProductSelected } from '../features/shop/shopSlice';
import Loader from '../components/Loader';

const ItemListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  
  // Obtenemos los productos ya filtrados por la categoría seleccionada en el paso anterior
  const products = useSelector((state) => state.shop.productsFiltered);
  const category = useSelector((state) => state.shop.categorySelected);
  const status = useSelector((state) => state.shop.status);

  /**
   * Navegación al detalle del producto.
   * Justificación: Actualizamos el estado global con el producto seleccionado 
   * antes de navegar para que la pantalla de detalle tenga la data lista.
   */
  const handleProductDetail = (item) => {
    dispatch(setProductSelected(item));
    navigation.navigate('ItemDetail'); // Nombre que definiremos en el Stack
  };

  // Componente de renderizado para cada producto (Reutilizable internamente)
  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => handleProductDetail(item)}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toLocaleString('es-AR')}</Text>
      </View>
    </TouchableOpacity>
  );

  // Si los productos se están descargando de Firebase, mostramos el Loader
  if (status === 'loading') return <Loader message={`Buscando ${category}...`} />;

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Explorando: {category}</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay productos en esta categoría.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerTitle: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 10,
    textTransform: 'uppercase',
  },
  listContent: { paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    overflow: 'hidden',
    // Sombras para elevación
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: 100, height: 100 },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: '600', color: '#333' },
  price: { fontSize: 18, fontWeight: '700', color: '#f4511e', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default ItemListScreen;