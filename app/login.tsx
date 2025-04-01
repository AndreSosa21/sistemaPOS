import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import loginStyles from '../Styles/login';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../utils/FireBaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        const userType = userDoc.data().userType;

        if (userType === 'mesero') {
          router.push('/mesero');
        } else if (userType === 'chef') {
          router.push('/chef');
        } else if (userType === 'cajero') {
          router.push('/caja');
        } else {
          router.push('/login');
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
        Alert.alert('Error', errorMessage);
      } else {
        Alert.alert('Error', 'Ha ocurrido un error inesperado');
      }
    }
  };

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.title}>Welcome to POSitive</Text>

      {/* Email Field */}
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

      {/* Password Field */}
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

      {/* Login Button */}
      <TouchableOpacity style={loginStyles.button} onPress={handleLogin} disabled={loading}>
        <Text style={loginStyles.buttonText}>
          {loading ? 'Cargando...' : 'Login'}
        </Text>
      </TouchableOpacity>

      {/* Redirect to Register */}
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
