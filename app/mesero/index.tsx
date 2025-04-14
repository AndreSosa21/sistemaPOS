// app/mesero/index.tsx
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
import { Camera, CameraView , CameraType} from 'expo-camera';
import { useTable } from '../../context/TablesContext';




const Mesero = () => {
  const { userType } = useContext(AuthContext);
  const [role, setRole] = useState('');
  const [showOrders, setOrders] = useState(false);
  const [showTable, setTable] = useState(false);
  const [showCart, setCart] = useState(false);
  const router = useRouter();
  const { tables } = useTable(); // Obtenemos las mesas desde el contexto
  // Obtenemos la función para actualizar la mesa seleccionada

  // --------------------------------
  // 1. Estados para manejar la cámara
  // --------------------------------
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const cameraRef = useRef<CameraView | null>(null);

  // Pedimos permiso de cámara cuando cargue el componente
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    requestPermission();
  }, []);

  // --------------------------------
  // Lógica para escanear
  // --------------------------------
  const handleScan = async ({ type, data }: { type: string; data: string }) => {
    if (data) {
      setScanning(false);  // Cierra el modal
      // Redirige a OrdersScreen con la mesa
      router.push(`/mesero/OrdersScreen?table=${data}`);
    }
  };

  useEffect(() => {
    if (userType === 'mesero') {
      setRole('Mesero');
    }
  }, [userType]);

  const handleTablePress = (tableNumber: string) => {
    router.push(`/mesero/TableOrdersScreen?table=${tableNumber}`);
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
          <Text style={meseroStyles.text}>Hello! Andrea</Text>
          <Text style={meseroStyles.roleText}>{role}</Text>
        </View>
        <Image
          source={require('../../assets/images/campana.png')}
          style={meseroStyles.footerIcon}
        />
      </View>

      {/* Status legend */}
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

      <ScrollView contentContainerStyle={meseroStyles.tableGrid}>
      {tables.map((table) => (
        <TouchableOpacity
            key={table.id}
            style={[
            meseroStyles.table,
            {
            backgroundColor: table.status === 'Occupied' ? '#BA3A3A' : '#409744',
            },
         ]}
          onPress={() => handleTablePress(table.id)}
          >
      <Text style={meseroStyles.tableText}>{table.name}</Text>
    </TouchableOpacity>
  ))}
</ScrollView>


      {/* Footer */}
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

        {/* Ícono para abrir la cámara y escanear QR */}
        <TouchableOpacity
          onPress={() => {
            // Solo abrimos la cámara si tenemos permiso
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

      {/* Modal para la vista de la cámara */}
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
