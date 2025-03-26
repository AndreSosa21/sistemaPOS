// app/register.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import registerStyles from '../Styles/register';
import { auth, db } from '../utils/FireBaseConfig';  // Asegúrate de exportar Firestore también
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('mesero');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleRegister = async () => {
    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar tipo de usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        userType: userType,
      });

      // Redirigir al login después de crear la cuenta
      router.push('/login');
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  return (
    <View style={registerStyles.container}>
      <Text style={registerStyles.header}>Registro</Text>
      <Text style={registerStyles.locationText}>Estás en: Registro</Text>
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
