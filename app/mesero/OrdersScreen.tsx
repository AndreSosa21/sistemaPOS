import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { useCrud } from '../../context/CrudContext';
import { useOrders } from '../../context/OrdersContext';
import { useTable } from '../../context/TablesContext';
import { orderScreenStyles } from '../../Styles/mesero/OrderScreen';
import { menuStyles, meseroStyles } from '../../Styles/mesero/index';
import Toast from 'react-native-toast-message';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthContext } from '../../context/AuthContext';
import { Camera, CameraView } from 'expo-camera';

const OrdersScreen = () => {
  const { products } = useCrud();
  const {
    cart,
    addToCart,
    setCart,
    selectedTable,
    setSelectedTable,
    confirmOrder,
  } = useOrders();
  const { tables } = useTable();
  const { userType, email } = useContext(AuthContext);
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  // Permisos y estado para escanear QR (tercera opción del footer)
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    // Solicitar permiso para cámara al iniciar
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    requestPermission();
  }, []);

  // Establecer nombre de usuario y rol para el header
  useEffect(() => {
    if (email) {
      setUsername(email.split('@')[0]);
    }
    if (userType === 'mesero') {
      setRole('Mesero');
    } else {
      setRole('');
    }
  }, [email, userType]);

  // Obtener el parámetro de mesa (si viene por URL)
  const { table } = useLocalSearchParams();
  useEffect(() => {
    if (table) {
      setSelectedTable(String(table));
    }
  }, [table]);

  // Funciones de manejo del carrito
  const increaseQuantity = (item: any) => {
    const newCart = cart.map((cartItem: any) =>
      cartItem.id === item.id
        ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
        : cartItem
    );
    setCart(newCart);
  };

  const decreaseQuantity = (item: any) => {
    const newCart = cart
      .map((cartItem: any) =>
        cartItem.id === item.id && (cartItem.quantity || 1) > 1
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      )
      .filter((cartItem: any) => cartItem.quantity > 0);
    setCart(newCart);
  };

  const handleRemoveFromCart = (item: any) => {
    const updatedCart = cart.filter((cartItem: any) => cartItem.id !== item.id);
    setCart(updatedCart);
  };

  const handleAddToCart = (product: any) => {
    const exists = cart.find((item: any) => item.id === product.id);
    if (exists) {
      increaseQuantity(product);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    Toast.show({
      type: 'success',
      text1: 'Producto añadido al carrito',
      text2: `${product.title} - $${product.price}`,
    });
  };

  const renderProduct = ({ item }: { item: any }) => {
    const itemInCart = cart.find((cartItem: any) => cartItem.id === item.id);
    const quantity = itemInCart?.quantity || 0;
    const totalPrice = quantity * item.price;
    return (
      <View style={orderScreenStyles.productItem}>
        <Image source={{ uri: item.imageUrl }} style={orderScreenStyles.productImage} />
        <View style={orderScreenStyles.productDetails}>
          <Text style={orderScreenStyles.productTitle}>
            {item.title} {quantity > 0 && `(${quantity})`}
          </Text>
          <Text style={orderScreenStyles.productPrice}>
            ${quantity > 0 ? totalPrice : item.price}
          </Text>
          <Text style={orderScreenStyles.productDescription}>{item.description}</Text>
        </View>
        <TouchableOpacity
          style={orderScreenStyles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={orderScreenStyles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={orderScreenStyles.cartItem}>
      <Text style={orderScreenStyles.cartItemText}>
        {item.title} ({item.quantity}) - ${item.quantity * item.price}
      </Text>
      <View style={orderScreenStyles.cartActions}>
        <TouchableOpacity onPress={() => decreaseQuantity(item)}>
          <Text style={orderScreenStyles.quantityButton}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => increaseQuantity(item)}>
          <Text style={orderScreenStyles.quantityButton}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRemoveFromCart(item)}>
          <Text style={orderScreenStyles.removeButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderizado del botón para cada mesa, obtenido del contexto de mesas
  const renderTable = (tableItem: { id: string; name: string; status: string }) => (
    <TouchableOpacity
      key={tableItem.id}
      style={[
        orderScreenStyles.tableButton,
        {
          backgroundColor: tableItem.status === 'Occupied' ? '#BA3A3A' : '#409744',
        },
        selectedTable === tableItem.id && orderScreenStyles.tableButtonSelected,
      ]}
      onPress={() => setSelectedTable(tableItem.id)}
    >
      <Text style={orderScreenStyles.tableButtonText}>{tableItem.name}</Text>
    </TouchableOpacity>
  );

  // Cálculo total del carrito
  const total = cart.reduce(
    (sum: number, item: { quantity: number; price: string }) =>
      sum + (item.quantity || 1) * parseFloat(item.price),
    0
  );

  const handleConfirm = async () => {
    if (!selectedTable) {
      Toast.show({
        type: 'error',
        text1: 'Mesa no seleccionada',
        text2: 'Por favor selecciona una mesa antes de confirmar la orden.',
      });
      return;
    }
    if (cart.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Carrito vacío',
        text2: 'Agrega productos antes de confirmar la orden.',
      });
      return;
    }
    await confirmOrder();
    Toast.show({
      type: 'success',
      text1: 'Orden confirmada correctamente',
    });
  };

  // Lógica para el escaneo de QR
  const handleScan = async ({ type, data }: { type: string; data: string }) => {
    if (data) {
      setScanning(false);
      router.push(`/mesero/OrdersScreen?table=${data}`);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header idéntico al index de mesero */}
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

      {/* Contenido principal scrollable */}
      <ScrollView style={orderScreenStyles.container}>
        <Text style={orderScreenStyles.headerText}>Menú del Restaurante</Text>
        <View style={{ marginBottom: 24 }}>
          {products.map((item) => (
            <View key={item.id} style={menuStyles.menuCard}>
              <Image source={{ uri: item.imageUrl }} style={menuStyles.menuImage} />
              <TouchableOpacity
                style={menuStyles.addButtonFloating}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={menuStyles.addButtonTextFloating}>Añadir</Text>
              </TouchableOpacity>
              <View style={menuStyles.menuInfo}>
                <Text style={menuStyles.menuTitle}>{item.title} 🔥</Text>
                <Text style={menuStyles.menuDescription}>{item.description}</Text>
                <Text style={menuStyles.itemPrice}>${parseFloat(item.price).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Línea divisoria */}
        <View style={orderScreenStyles.divider} />

        {/* Sección del carrito */}
        <View style={orderScreenStyles.orderSection}>
          <Text style={orderScreenStyles.sectionTitle}>Carrito</Text>
          {cart.length === 0 ? (
            <Text style={orderScreenStyles.emptyCartText}>
              No hay productos en el carrito
            </Text>
          ) : (
            <FlatList
              data={cart}
              keyExtractor={(item) => item.id}
              renderItem={renderCartItem}
            />
          )}

          <Text style={orderScreenStyles.sectionTitle}>Seleccione Mesa</Text>
          <View style={orderScreenStyles.tableGrid}>
            {tables.map((tableItem) => renderTable(tableItem))}
          </View>

          <Text style={orderScreenStyles.selectedTableText}>
            Mesa Seleccionada: {selectedTable || 'Ninguna'}
          </Text>

          <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
            Total: ${total.toFixed(2)}
          </Text>

          <TouchableOpacity
            style={orderScreenStyles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={orderScreenStyles.confirmButtonText}>Confirmar Orden</Text>
          </TouchableOpacity>
        </View>

        <Toast />
      </ScrollView>

      {/* Footer idéntico al index de mesero */}
      <View style={meseroStyles.footer}>
        <TouchableOpacity onPress={() => router.push('/mesero')}>
          <Image
            source={require('../../assets/images/home.png')}
            style={meseroStyles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/mesero/OrdersScreen')}>
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
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Image
            source={require('../../assets/images/out.png')}
            style={meseroStyles.footerIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Modal para escanear QR */}
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

export default OrdersScreen;
