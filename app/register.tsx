import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import registerStyles from '../Styles/register';
import bcrypt from 'bcryptjs';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../utils/FireBaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const { register } = useContext(AuthContext);
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        userType: userType,
        password: hashedPassword,
      });

      router.push('/login');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al registrar el usuario');
      console.error('Error al registrar:', error);
    }
  };

  return (
    <View style={registerStyles.container}>
      <Text style={registerStyles.header}>Welcome to POSitive</Text>

      {/* Email Field */}
      <View style={registerStyles.inputContainer}>
        <Image source={require('../assets/images/persona.png')} style={registerStyles.icon} />
        <TextInput
          style={registerStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Password Field */}
      <View style={registerStyles.inputContainer}>
        <Image source={require('../assets/images/candado.png')} style={registerStyles.icon} />
        <TextInput
          style={registerStyles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Role Field */}
      <View style={registerStyles.inputContainer}>
        <Image source={require('../assets/images/rol.png')} style={registerStyles.icon} />
        <Picker
          selectedValue={userType}
          onValueChange={(itemValue: string) => setUserType(itemValue)}
          style={registerStyles.picker}
          prompt="Select Role"
        >
          <Picker.Item label="Select Role" value="" style={registerStyles.pickerItem} />
          <Picker.Item label="Mesero" value="mesero" style={registerStyles.pickerItem} />
          <Picker.Item label="Chef" value="chef" style={registerStyles.pickerItem} />
          <Picker.Item label="Cajero" value="cajero" style={registerStyles.pickerItem} />
        </Picker>
      </View>

      {/* Register Button */}
      <TouchableOpacity style={registerStyles.button} onPress={handleRegister}>
        <Text style={registerStyles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Redirect to Login */}
      <View style={registerStyles.loginLinkContainer}>
        <Text style={registerStyles.linkText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={registerStyles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;
