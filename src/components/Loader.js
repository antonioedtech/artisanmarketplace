import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const Loader = ({ message = "Cargando artesanías..." }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#f4511e" />
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default Loader;