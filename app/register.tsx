// Importación de React, hooks, componentes y utilidades necesarias para el registro de usuario
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import registerStyles from '../Styles/register';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../utils/FireBaseConfig';
import { doc, setDoc, getDocs, query, collection, where } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

// Componente de Registro para crear nuevos usuarios
const Register = () => {
  // Estados locales para email, contraseña, tipo de usuario, visibilidad del modal y mensaje de error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [modalVisible, setModalVisible] = useState(false);  // Estado para controlar el Modal
  const [errorMessage, setErrorMessage] = useState('');  // Estado para el mensaje de error
  // Obtención de la función register del contexto de autenticación
  const { register } = useContext(AuthContext);
  // Hook para navegación
  const router = useRouter();

  // Función para validar los campos del formulario
  const validateFields = () => {
    if (!email || !password || !userType) {
      setErrorMessage('Por favor, complete todos los campos.');
      setModalVisible(true);
      return false;
    }

    // Validación del formato del email con expresión regular
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Por favor, ingrese un email válido.');
      setModalVisible(true);
      return false;
    }

    // Verifica que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      setModalVisible(true);
      return false;
    }

    return true;
  };

  // Función para manejar el registro del usuario
  const handleRegister = async () => {
    // Verificar las validaciones antes de proceder
    if (!validateFields()) {
      return;
    }

    // Controlar que sólo exista un administrador en la base de datos
    if (userType === 'admin') {
      // Consulta para verificar si ya existe un admin registrado
      const q = query(collection(db, "users"), where("userType", "==", "admin"));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Si ya existe un admin, se muestra un mensaje de error y se evita crear un nuevo admin
        setErrorMessage('Ya existe un administrador en la base de datos. No se puede registrar otro.');
        setModalVisible(true);  // Muestra el Modal
        return;
      }
    }

    try {
      // Crea el usuario en Firebase Authentication con email y password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guarda la información del usuario en Firestore, en la colección 'users'
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        userType: userType,
      });

      // Redirige al usuario a la página de login luego del registro exitoso
      router.push('/login');
    } catch (error) {
      // Muestra un mensaje de error en caso de falla en el registro
      setErrorMessage('Hubo un problema al registrar el usuario');
      setModalVisible(true);  // Muestra el Modal con el mensaje de error
      console.error('Error al registrar:', error);
    }
  };

  return (
    // Contenedor principal del registro utilizando estilos importados
    <View style={registerStyles.container}>
      <Text style={registerStyles.header}>Welcome to POSitive</Text>

      {/* Campo de entrada para el Email */}
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

      {/* Campo de entrada para la Contraseña */}
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

      {/* Selector para elegir el rol del usuario */}
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

      {/* Botón de registro que llama a handleRegister */}
      <TouchableOpacity style={registerStyles.button} onPress={handleRegister}>
        <Text style={registerStyles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Enlace para redirigir a la pantalla de Login */}
      <View style={registerStyles.loginLinkContainer}>
        <Text style={registerStyles.linkText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={registerStyles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de alerta para mostrar mensajes de error */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={registerStyles.modalBackground}> {/* Fondo transparente */}
          <View style={registerStyles.modalView}> {/* Contenido del modal */}
            <Text style={registerStyles.modalText}>{errorMessage}</Text>
            <TouchableOpacity
              style={registerStyles.button}
              onPress={() => setModalVisible(false)}  // Cierra el modal
            >
              <Text style={registerStyles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Register;
