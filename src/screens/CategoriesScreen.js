import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setCategorySelected, getProductsFromDb } from '../features/shop/shopSlice';
import Loader from '../components/Loader';

const CategoriesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Extraemos estados desde Redux
  const { categories, loading, error } = useSelector((state) => state.shop);

  /**
   * Hook de efecto: Disparador de datos.
   * Justificación: useEffect con [] asegura que la petición a Firebase
   * solo ocurra una vez al iniciar la aplicación, optimizando el ancho de banda.
   */
  useEffect(() => {
    dispatch(getProductsFromDb());
  }, [dispatch]);

  const onSelectCategory = (category) => {
    dispatch(setCategorySelected(category));
    navigation.navigate('Products', { categoryTitle: category });
  };

  // Gestión de estados asíncronos (Guard Clauses)
  if (loading) return <Loader />;
  
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
  text: { fontSize: 18, fontWeight: 'bold' }
});

export default CategoriesScreen;