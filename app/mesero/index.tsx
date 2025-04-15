// ===============================================================
// Archivo: mesero/index.tsx
// Propósito: Pantalla principal para el Mesero, que muestra el saludo,
// el estado de las mesas (disponible/ocupada), y permite la navegación
// a otras secciones. Incluye funcionalidad de escaneo QR para acceder a pedidos.
// ===============================================================

import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
// Contexto de autenticación para datos de usuario
import { AuthContext } from '../../context/AuthContext';
// Estilos específicos para la pantalla del Mesero
import { meseroStyles } from '../../Styles/mesero/index';
// Hook para navegación con Expo Router
import { useRouter } from 'expo-router';
// Se importan componentes y tipos de cámara de Expo
import { Camera, CameraView, CameraType } from 'expo-camera';
// Contexto para obtener datos de mesas
import { useTable } from '../../context/TablesContext';

const Mesero = () => {
  // Extrae datos del usuario desde AuthContext
  const { userType, email } = useContext(AuthContext);
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  // Estado para controlar el escaneo QR
  const [scanning, setScanning] = useState<boolean>(false);
  const router = useRouter();
  // Se obtienen las mesas disponibles desde el contexto
  const { tables } = useTable();

  // Estados para manejar permisos y referencia de la cámara
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const cameraRef = useRef<CameraView | null>(null);

  // Solicita permiso para usar la cámara al montar el componente
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    requestPermission();
  }, []);

  // Extraer el nombre de usuario a partir del email
  useEffect(() => {
    if (email) {
      const user = email.split('@')[0];
      setUsername(user);
    }
  }, [userType, email]);

  // Actualiza el rol en caso de ser mesero
  useEffect(() => {
    if (userType === 'mesero') {
      setRole('Mesero');
    }
  }, [userType]);

  // Función para manejar el escaneo del código QR, redirige a la pantalla de pedidos con la mesa
  const handleScan = async ({ type, data }: { type: string; data: string }) => {
    if (data) {
      setScanning(false);
      router.push(`/mesero/OrdersScreen?table=${data}`);
    }
  };

  // Función para manejar el toque sobre una mesa; redirige a la pantalla de pedidos de la mesa
  const handleTablePress = (tableId: string) => {
    router.push(`/mesero/TableOrdersScreen?table=${tableId}`);
  };

  // Función para la navegación del footer (pedidos, perfil, logout)
  const handleNavigation = (screen: string) => {
    if (screen === 'orders') {
      router.push('/mesero/OrdersScreen');
    } else if (screen === 'profile') {
      router.push('/mesero');
    } else if (screen === 'logout') {
      router.push('/login');
    }
  };

  return (
    <View style={meseroStyles.container}>
      {/* HEADER: saludo y rol */}
      <View style={meseroStyles.header}>
        <View>
          <Text style={meseroStyles.text}>Hello! {username}</Text>
          <Text style={meseroStyles.roleText}>{role}</Text>
        </View>
        <Image
          source={require('../../assets/images/campana.png')}
          style={meseroStyles.footerIcon}
        />
      </View>

      {/* Indicadores de estado de las mesas */}
      <View style={meseroStyles.statusIndicators}>
        <View style={meseroStyles.dotLabel}>
          <View style={[meseroStyles.dot, { backgroundColor: '#409744' }]} />
          <Text>Available</Text>
        </View>
        <View style={meseroStyles.dotLabel}>
          <View style={[meseroStyles.dot, { backgroundColor: '#BA3A3A' }]} />
          <Text>Occupied</Text>
        </View>
      </View>

      {/* Grid de mesas: muestra cada mesa con color de fondo según su estado */}
      <ScrollView contentContainerStyle={meseroStyles.tableGrid}>
        {tables.map((table) => (
          <TouchableOpacity
            key={table.id}
            style={[
              meseroStyles.table,
              {
                backgroundColor:
                  table.status === 'Occupied' ? '#BA3A3A' : '#409744',
              },
            ]}
            onPress={() => handleTablePress(table.id)}
          >
            <Text style={meseroStyles.tableText}>{table.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FOOTER: navegación entre pantallas */}
      <View style={meseroStyles.footer}>
        <TouchableOpacity onPress={() => router.push('/mesero')}>
          <Image
            source={require('../../assets/images/home.png')}
            style={meseroStyles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('orders')}>
          <Image
            source={require('../../assets/images/order.png')}
            style={meseroStyles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (hasPermission) {
              setScanning(true);
            } else {
              alert('No tienes permiso para usar la cámara');
            }
          }}
        >
          <Image
            source={require('../../assets/images/QR.png')}
            style={meseroStyles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNavigation('logout')}>
          <Image
            source={require('../../assets/images/out.png')}
            style={meseroStyles.footerIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Modal para escanear QR, visible cuando 'scanning' es true */}
      {scanning && (
        <Modal transparent={true} visible={scanning}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.8)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CameraView
              ref={cameraRef}
              style={{ width: '100%', height: '100%' }}
              onBarcodeScanned={handleScan}
            />
            <TouchableOpacity
              onPress={() => setScanning(false)}
              style={{
                position: 'absolute',
                top: 50,
                right: 30,
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text style={{ fontWeight: 'bold' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Mesero;
