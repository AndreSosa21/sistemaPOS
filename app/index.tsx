// Importación de hooks y componentes necesarios de React y React Native, además de Expo Router para la navegación
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// Componente principal que funciona como splash screen o página inicial
export default function Index() {
  // Obtención del hook para manejar la navegación
  const router = useRouter();

  // useEffect para realizar la redirección luego de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      // Redirecciona al usuario a la pantalla de login
      router.replace('/login');
    }, 5000);
    // Limpia el timer en caso de desmontarse el componente
    return () => clearTimeout(timer);
  }, [router]);

  return (
    // Contenedor principal con un ActivityIndicator para mostrar una animación de carga
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}

// Definición de estilos del componente utilizando StyleSheet de React Native
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
