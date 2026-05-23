import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentLocationAsync } from '../features/location/locationSlice';
import Loader from '../components/Loader';

const MapScreen = () => {
  const dispatch = useDispatch();
  const { userLocation, pickupPoints, status, error } = useSelector((state) => state.location);

  // Disparar la solicitud de GPS inmediatamente al montar la pantalla
  useEffect(() => {
    dispatch(getCurrentLocationAsync());
  }, [dispatch]);

  // Gestión de errores mediante alertas nativas
  useEffect(() => {
    if (error) {
      Alert.alert("Error de Ubicación", error);
    }
  }, [error]);

  if (status === 'loading' || !userLocation) {
    return <Loader message="Obteniendo coordenadas GPS..." />;
  }

  // Delta define el nivel de zoom del mapa (0.0922 es estándar para calles de una ciudad)
  const initialRegion = {
    ...userLocation,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // Fuerza el uso de Google Maps en iOS y Android para consistencia de diseño
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}    // Muestra el punto azul nativo del usuario
      >
        {/* Renderizado dinámico de los puntos de retiro físicos */}
        {pickupPoints.map((point) => (
          <Marker
            key={point.id}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            title={point.title}
            description="Punto de retiro oficial de ArtisanMarket"
            pinColor="#f4511e" // Consistencia con la paleta de la marca
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },
});

export default MapScreen;