// app/login.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import loginStyles from '../Styles/login';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../utils/FireBaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app'; // Importamos FirebaseError

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Inicia sesión con Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Recuperar el tipo de usuario desde Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const userType = userDoc.data().userType;

        // Redirigir según el tipo de usuario
        if (userType === 'mesero') {
          router.push('/mesero');  // Redirige a la pantalla de mesero
        } else if (userType === 'chef') {
          router.push('/chef');  // Redirige a la pantalla de chef
        } else if (userType === 'cajero') {
          router.push('/caja');  // Redirige a la pantalla de cajero
        } else {
          router.push('/login');  // Redirige al login si no se encuentra el rol
        }
      } else {
        Alert.alert('Error', 'No se encontró el rol del usuario');
        router.push('/login');
      }
    } catch (error) {
      setLoading(false);
      if (error instanceof FirebaseError) {
        let errorMessage = '';
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'Usuario no encontrado';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Contraseña incorrecta';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Email inválido';
            break;
          default:
            errorMessage = 'Error al iniciar sesión';
            break;
        }
        Alert.alert('Error', errorMessage);  // Muestra un alerta con el mensaje de error
      } else {
        Alert.alert('Error', 'Ha ocurrido un error inesperado');
      }
    }
  };

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.title}>Login</Text>
      <TextInput
        style={loginStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={loginStyles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={loginStyles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={loginStyles.buttonText}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={loginStyles.linkText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
