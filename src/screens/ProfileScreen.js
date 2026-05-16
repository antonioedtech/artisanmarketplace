import React, { useState } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Recomendado para integración galería/cámara

const ProfileScreen = () => {
  const [image, setImage] = useState(null);

  const takePhoto = async () => {
    // Solicitud de permisos en tiempo de ejecución (Mejor Práctica)
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (granted) {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Optimización de peso para Firebase
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.avatar} />}
      <Button title="Tomar Foto de Perfil" onPress={takePhoto} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 200, height: 200, borderRadius: 100, marginBottom: 20 }
});

export default ProfileScreen;