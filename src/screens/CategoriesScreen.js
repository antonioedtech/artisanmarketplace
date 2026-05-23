import React from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setCategorySelected, getProductsFromDb } from '../features/shop/shopSlice';
import Loader from '../components/Loader';

const CategoriesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Extraemos estados desde Redux
  const { categories, status, error } = useSelector((state) => state.shop);

  const onSelectCategory = (category) => {
    dispatch(setCategorySelected(category));
    navigation.navigate('Products', { categoryTitle: category });
  };

  // Gestión de estados asíncronos (Guard Clauses)
  if (status === 'loading') return <Loader message="Cargando categorías..." />;
  
  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error al conectar con la tienda: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.categoryItem} 
            onPress={() => onSelectCategory(item)}
          >
            <Text style={styles.text}>{item}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron categorías disponibles.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  categoryItem: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#f9c2ff',
    borderRadius: 10,
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  text: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default CategoriesScreen;