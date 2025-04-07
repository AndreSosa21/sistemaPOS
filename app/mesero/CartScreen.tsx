// app/mesero/CartScreen.tsx
import React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useOrders } from '../../context/OrdersContext';
import { cartStyles } from '../../Styles/mesero/index';
import { useRouter } from 'expo-router';

const CartScreen = () => {
  const {
    cart,
    selectedTable,
    setSelectedTable,
    confirmOrder,
  } = useOrders();

  const router = useRouter();

  const total = cart.reduce((sum: number, item: { price: string; }) => sum + parseFloat(item.price), 0);

  const handleConfirm = async () => {
    if (!selectedTable) {
      Alert.alert('Error', 'Por favor ingresa el número de la mesa');
      return;
    }
    if (cart.length === 0) {
      Alert.alert('Carrito vacío', 'No hay productos para enviar.');
      return;
    }

    try {
      await confirmOrder();
      Alert.alert('Éxito', 'Orden confirmada correctamente');
      router.push('/mesero');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar la orden');
    }
  };

  return (
    <View style={cartStyles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Carrito</Text>

      <TextInput
        placeholder="Número de mesa (Ej: T-1)"
        value={selectedTable || ''}
        onChangeText={setSelectedTable}
        style={cartStyles.input}
      />

      <FlatList
        data={cart}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={cartStyles.item}>
            • {item.title} - ${item.price}
          </Text>
        )}
      />

      <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Total: ${total.toFixed(2)}</Text>

      <TouchableOpacity style={cartStyles.confirmButton} onPress={handleConfirm}>
        <Text style={cartStyles.confirmButtonText}>Confirmar Orden</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartScreen;
