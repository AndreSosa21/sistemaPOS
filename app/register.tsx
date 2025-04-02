// app/register.tsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import registerStyles from '../Styles/register';
import bcrypt from 'bcryptjs';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../utils/FireBaseConfig';
import { doc, setDoc, getDocs, query, collection, where } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [modalVisible, setModalVisible] = useState(false);  // Estado para controlar el Modal
  const { register } = useContext(AuthContext);
  const router = useRouter();

  const handleRegister = async () => {
    if (userType === 'admin') {
      // Verifica si ya hay un admin en la base de datos
      const q = query(collection(db, "users"), where("userType", "==", "admin"));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Si ya existe un admin, muestra una alerta con el Modal y no guarda el nuevo admin
        setModalVisible(true);  // Muestra el Modal
        return;
      }
    }

    try {
      // Hashea la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Crea el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guarda el nuevo usuario en la base de datos
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        userType: userType,
        password: hashedPassword,
      });

      // Redirige a la página de login
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
          <Picker.Item label="Admin" value="admin" style={registerStyles.pickerItem} />
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

      {/* Modal de alerta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={registerStyles.modalView}>
          <Text style={registerStyles.modalText}>Ya existe un administrador en la base de datos. No se puede registrar otro.</Text>
          <TouchableOpacity
            style={registerStyles.button}
            onPress={() => {
              setModalVisible(false);  // Cierra el modal
              router.push('/login');  // Redirige al login
            }}
          >
            <Text style={registerStyles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Register;
