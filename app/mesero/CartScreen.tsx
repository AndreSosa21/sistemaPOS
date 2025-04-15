// ===============================================================
// Archivo: mesero/CartScreen.tsx
// Propósito: Pantalla de carrito para el Mesero, que muestra los
// productos agregados, permite confirmar la orden y muestra el total.
// ===============================================================

import React from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
// Uso del contexto de órdenes para acceder al carrito y funciones asociadas
import { useOrders } from '../../context/OrdersContext';
// Importación de estilos específicos para el carrito
import { cartStyles } from '../../Styles/mesero/index';
// Hook para navegación con Expo Router
import { useRouter } from 'expo-router';

const CartScreen = () => {
  // Se extraen datos y funciones del contexto de órdenes:
  // - cart: productos en el carrito
  // - selectedTable: mesa seleccionada
  // - setSelectedTable: función para cambiar la mesa
  // - confirmOrder: función para confirmar el envío de la orden
  const { cart, selectedTable, setSelectedTable, confirmOrder } = useOrders();

  const router = useRouter();

  // Cálculo del total sumando el precio de cada item (con conversión a número)
  const total = cart.reduce((sum: number, item: { price: string; }) => sum + parseFloat(item.price), 0);

  // Manejo de la confirmación de la orden, con validaciones y alertas
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

      {/* Input para ingresar el número de mesa */}
      <TextInput
        placeholder="Número de mesa (Ej: T-1)"
        value={selectedTable || ''}
        onChangeText={setSelectedTable}
        style={cartStyles.input}
      />

      {/* Listado de productos en el carrito */}
      <FlatList
        data={cart}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={cartStyles.item}>
            • {item.title} - ${item.price}
          </Text>
        )}
      />

      {/* Muestra el total calculado */}
      <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Total: ${total.toFixed(2)}</Text>

      {/* Botón para confirmar la orden */}
      <TouchableOpacity style={cartStyles.confirmButton} onPress={handleConfirm}>
        <Text style={cartStyles.confirmButtonText}>Confirmar Orden</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartScreen;
