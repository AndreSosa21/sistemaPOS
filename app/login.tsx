// app/login.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import loginStyles from '../Styles/login';
import { FirebaseError } from 'firebase/app';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/FireBaseConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await login(email, password);
      const user = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const userType = userDoc.data().userType;
        
        switch(userType) {
          case 'mesero':
            router.push('/mesero');
            break;
          case 'chef':
            router.push('/chef');
            break;
          case 'cajero':
            router.push('/caja');
            break;
          case 'admin':
            router.push('/admin');
            break;
          default:
            Alert.alert('Error', 'Rol de usuario no válido');
            router.push('/login');
        }
      } else {
        Alert.alert('Error', 'Usuario no registrado en la base de datos');
        router.push('/login');
      }
    } catch (error) {
      setLoading(false);

      if (error instanceof FirebaseError) {
        let errorMessage = 'Error al iniciar sesión';
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = 'Usuario no encontrado';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Contraseña incorrecta';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Formato de email inválido';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Demasiados intentos, intente más tarde';
            break;
        }
        Alert.alert('Error', errorMessage);
      } else {
        Alert.alert('Error', 'Error inesperado');
        console.error('Error detallado:', error);
      }
    }
  };

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.title}>Welcome to POSitive</Text>

      <View style={loginStyles.inputContainer}>
        <Image source={require('../assets/images/persona.png')} style={loginStyles.icon} />
        <TextInput
          style={loginStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={loginStyles.inputContainer}>
        <Image source={require('../assets/images/candado.png')} style={loginStyles.icon} />
        <TextInput
          style={loginStyles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        style={loginStyles.button} 
        onPress={handleLogin} 
        disabled={loading}
      >
        <Text style={loginStyles.buttonText}>
          {loading ? 'Cargando...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <View style={loginStyles.loginLinkContainer}>
        <Text style={loginStyles.linkText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={loginStyles.registerText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;