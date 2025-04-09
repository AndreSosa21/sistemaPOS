import React, { useState, useEffect, useRef } from 'react';
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
import { orderScreenStyles } from '../../Styles/mesero/OrderScreen';
import Toast from 'react-native-toast-message';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import { CameraModal } from '../../components/CameraModal';

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
  const router = useRouter();

  const tables = ['T-1', 'T-2', 'T-3', 'T-4', 'T-5', 'T-6'];
  const [hasPermission, setHasPermission] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanData, setScanData] = useState<string | null>(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    requestPermission();
  }, []);

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
      .filter((cartItem: any) => cartItem.quantity !== 0);
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

  const renderTable = (tableLabel: string) => (
    <TouchableOpacity
      key={tableLabel}
      style={[
        orderScreenStyles.tableButton,
        selectedTable === tableLabel && orderScreenStyles.tableButtonSelected,
      ]}
      onPress={() => setSelectedTable(tableLabel)}
    >
      <Text style={orderScreenStyles.tableButtonText}>{tableLabel}</Text>
    </TouchableOpacity>
  );

  const total = cart.reduce(
    (sum: number, item: { quantity: any; price: string; }) => sum + (item.quantity || 1) * parseFloat(item.price),
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

  const handleScan = async (type: any, data: string) => {
    if (data) {
      setScanData(data);
      router.push(`/mesero/TableOrdersScreen?table=${data}`);
      setScanning(false);
    }
  };

  return (
    <ScrollView style={orderScreenStyles.container}>
      <View style={orderScreenStyles.header}>
        <Text style={orderScreenStyles.headerText}>Menú del Restaurante</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id?.toString() || ''}
        renderItem={renderProduct}
        contentContainerStyle={orderScreenStyles.productList}
        scrollEnabled={false}
      />

      <View style={orderScreenStyles.divider} />

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
          {tables.map((table) => renderTable(table))}
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

        {/* Botón para escanear código QR */}
        <TouchableOpacity onPress={() => setScanning(true)} style={orderScreenStyles.scanButton}>
          <Text style={orderScreenStyles.scanButtonText}>Escanear Código QR</Text>
        </TouchableOpacity>

        {/* Modal para escanear código QR */}
        {scanning && hasPermission && (
          <Modal transparent={true} visible={scanning}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={{ width: '100%', height: '100%' }}>
                <CameraView
                  style={orderScreenStyles.camera}
                  ref={cameraRef}
                  onBarcodeScanned={({ type, data }: { type: string; data: string }) => handleScan(type, data)}
                />
              </View>
              <TouchableOpacity onPress={() => setScanning(false)} style={{ position: 'absolute', top: 50, right: 20 }}>
                <Text style={{ color: 'white' }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>

      <Toast />
    </ScrollView>
  );
};

export default OrdersScreen;
