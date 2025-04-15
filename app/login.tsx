// Importaciones necesarias de React, componentes de React Native, navegación y contextos para la autenticación
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import loginStyles from '../Styles/login';
import { FirebaseError } from 'firebase/app';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/FireBaseConfig';

// Componente de Login para la autenticación del usuario
const Login = () => {
  // Estados locales para email, password, loading, modal de error y mensaje de error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Uso del contexto de autenticación para la función login
  const { login } = useContext(AuthContext);
  // Hook para la navegación
  const router = useRouter();

  // Función encargada de manejar el inicio de sesión
  const handleLogin = async () => {
    // Validación de campos vacíos
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, complete todos los campos.');
      setModalVisible(true);
      return;
    }

    setLoading(true);

    try {
      // Intenta iniciar sesión con el email y password proporcionados
      const userCredential = await login(email, password);
      const user = userCredential.user;
      
      // Obtiene el documento del usuario en la colección 'users' de Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        // Se extrae el tipo de usuario del documento para dirigir al usuario a la pantalla correspondiente
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
            // En caso de rol no válido, se muestra un mensaje de error y se redirige de nuevo a login
            setErrorMessage('Rol de usuario no válido');
            setModalVisible(true);
            router.push('/login');
        }
      } else {
        // En caso de que el documento del usuario no exista en Firestore, se muestra un error y se redirige a login
        setErrorMessage('Usuario no registrado en la base de datos');
        setModalVisible(true);
        router.push('/login');
      }
    } catch (error) {
      // Manejo de errores para la autenticación y redirección de mensajes específicos según el error de Firebase
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
        setErrorMessage(errorMessage);
        setModalVisible(true);
      } else {
        // Manejo de cualquier otro error inesperado
        setErrorMessage('Error inesperado');
        console.error('Error detallado:', error);
        setModalVisible(true);
      }
    }
  };

  return (
    // Contenedor principal del login utilizando estilos importados
    <View style={loginStyles.container}>
      {/* Título de la aplicación */}
      <Text style={loginStyles.title}>Welcome to POSitive</Text>

      {/* Campo de entrada para el email */}
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

      {/* Campo de entrada para la contraseña */}
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

      {/* Botón de Login que invoca la función handleLogin */}
      <TouchableOpacity 
        style={loginStyles.button} 
        onPress={handleLogin} 
        disabled={loading}
      >
        <Text style={loginStyles.buttonText}>
          {loading ? 'Cargando...' : 'Login'}
        </Text>
      </TouchableOpacity>

      {/* Enlace para redirigir a la página de registro */}
      <View style={loginStyles.loginLinkContainer}>
        <Text style={loginStyles.linkText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={loginStyles.registerText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Error para mostrar mensajes de error al usuario */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={loginStyles.modalBackground}>
          <View style={loginStyles.modalView}>
            <Text style={loginStyles.modalText}>{errorMessage}</Text>
            <TouchableOpacity
              style={loginStyles.button}
              onPress={() => setModalVisible(false)} // Cierra el modal
            >
              <Text style={loginStyles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Login;
