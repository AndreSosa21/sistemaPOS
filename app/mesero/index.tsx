import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { meseroStyles } from '../../Styles/mesero/index';
import { useRouter } from 'expo-router';
import { Camera, CameraView, CameraType } from 'expo-camera';
import { useTable } from '../../context/TablesContext';

const Mesero = () => {
  const { userType, email } = useContext(AuthContext);
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [scanning, setScanning] = useState<boolean>(false);
  const router = useRouter();
  const { tables } = useTable(); // Se obtienen las mesas desde el contexto

  // Estados para manejar la cámara
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const cameraRef = useRef<CameraView | null>(null);

  // Pedir permiso de cámara al cargar
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    requestPermission();
  }, []);

  // Setear nombre de usuario
  useEffect(() => {
    if (email) {
      const user = email.split('@')[0];
      setUsername(user);
    }
  }, [userType, email]);

  // Actualización del rol
  useEffect(() => {
    if (userType === 'mesero') {
      setRole('Mesero');
    }
  }, [userType]);

  // Función para escanear QR y redirigir según la mesa obtenida
  const handleScan = async ({ type, data }: { type: string; data: string }) => {
    if (data) {
      setScanning(false);
      router.push(`/mesero/OrdersScreen?table=${data}`);
    }
  };

  const handleTablePress = (tableId: string) => {
    router.push(`/mesero/TableOrdersScreen?table=${tableId}`);
  };

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
      {/* Header */}
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

      {/* Leyenda de estado (disponible y ocupada) */}
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

      {/* Grid de mesas */}
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

      {/* Footer de navegación */}
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

      {/* Modal para cámara (escaneo QR) */}
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
