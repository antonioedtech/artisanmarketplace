import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signInAsync, clearAuthError } from '../features/auth/authSlice';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      let friendlyMessage = 'Credenciales inválidas.';
      if (error === 'EMAIL_NOT_FOUND' || error === 'INVALID_PASSWORD') {
        friendlyMessage = 'El correo electrónico o la contraseña son incorrectos.';
      }
      if (error === 'USER_DISABLED') {
        friendlyMessage = 'Esta cuenta de usuario ha sido deshabilitada.';
      }

      Alert.alert('Error de Autenticación', friendlyMessage);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  const handleLogin = () => {
    if (!email.trim() || !password) {
      Alert.alert('Campos vacíos', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }
    dispatch(signInAsync({ email: email.trim(), password }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ArtisanMarket</Text>
      <Text style={styles.subtitle}>Socio Tecnológico Retail</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
        editable={status !== 'loading'}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={password}
        onChangeText={setPassword}
        editable={status !== 'loading'}
      />

      <TouchableOpacity 
        style={[styles.button, status === 'loading' && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Ingresar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('Register')}
        disabled={status === 'loading'}
      >
        <Text style={styles.switchText}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f4511e',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 36,
  },
  input: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#f4511e',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#ffab91',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});