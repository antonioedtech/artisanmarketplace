import { StyleSheet, View, Text, Alert, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addItemAsync } from '../features/cart/cartSlice';

// 2. Dentro del componente ItemDetailScreen:
const ItemDetailScreen = () => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.shop.productSelected);

  const handleAddToCart = () => {
    if (product) {
      // Despachamos el producto actual al carrito
      dispatch(addItemAsync(product));
      Alert.alert("Éxito", `${product.title} se añadió al carrito.`);
    }
  };

  if (!product) return null; // Guard clause por si el estado se limpia

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price.toLocaleString('es-AR')}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.descriptionTitle}>Descripción</Text>
        <Text style={styles.description}>{product.description}</Text>

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddToCart}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>Agregar al Carrito</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f4511e',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: '#f4511e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#f4511e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ItemDetailScreen;