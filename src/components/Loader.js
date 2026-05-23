import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';

const Loader = ({ message }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f4511e" />
      <Text style={styles.text}>{message || "Cargando ArtisanMarket..."}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
});

export default Loader;