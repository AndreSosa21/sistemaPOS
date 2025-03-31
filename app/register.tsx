// app/register.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import registerStyles from '../Styles/register';
import bcrypt from 'bcryptjs';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../utils/FireBaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';  // Asegúrate de importar Picker

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('mesero');
  const { register } = useContext(AuthContext);
  const router = useRouter();

  const handleRegister = async () => {
    try {
      // Hasheamos la contraseña antes de registrarla
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar usuario con la contraseña hasheada en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        userType: userType,
        password: hashedPassword,  // Guardamos la contraseña hasheada
      });

      // Redirigir al login después de registrarse
      router.push('/login');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al registrar el usuario');
      console.error('Error al registrar:', error);
    }
  };

  return (
    <View style={registerStyles.container}>
      <Text style={registerStyles.header}>Registro</Text>
      <TextInput
        style={registerStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={registerStyles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={registerStyles.pickerContainer}>
        <Picker
          selectedValue={userType}
          onValueChange={(itemValue: string) => setUserType(itemValue)}
          style={registerStyles.picker}
        >
          <Picker.Item label="Mesero" value="mesero" />
          <Picker.Item label="Chef" value="chef" />
          <Picker.Item label="Cajero" value="cajero" />
        </Picker>
      </View>
      <TouchableOpacity style={registerStyles.button} onPress={handleRegister}>
        <Text style={registerStyles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={registerStyles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;
