import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signUpAsync, clearAuthError } from '../features/auth/authSlice';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  // Limpiar errores previos del store al montar la pantalla
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Manejo de errores devueltos por el servidor de Firebase
  useEffect(() => {
    if (error) {
      let friendlyMessage = 'Ocurrió un error inesperado.';
      if (error === 'EMAIL_EXISTS') friendlyMessage = 'El correo electrónico ya está registrado.';
      if (error === 'INVALID_EMAIL') friendlyMessage = 'El formato del correo no es válido.';
      if (error === 'WEAK_PASSWORD') friendlyMessage = 'La contraseña debe tener al menos 6 caracteres.';
      
      Alert.alert('Error de Registro', friendlyMessage);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  const handleRegister = () => {
    // Validaciones de negocio en el cliente (Client-side validation)
    if (!email.trim() || !password || !confirmPassword) {
      Alert.alert('Campos incompletos', 'Por favor, completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Contraseñas no coinciden', 'Las contraseñas ingresadas deben ser idénticas.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Contraseña débil', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    dispatch(signUpAsync({ email: email.trim(), password }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ArtisanMarket</Text>
      <Text style={styles.subtitle}>Crea una cuenta para comenzar</Text>

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

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={status !== 'loading'}
      />

      <TouchableOpacity 
        style={[styles.button, status === 'loading' && styles.buttonDisabled]} 
        onPress={handleRegister}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        disabled={status === 'loading'}
      >
        <Text style={styles.switchText}>¿Ya tienes cuenta? Inicia sesión aquí</Text>
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