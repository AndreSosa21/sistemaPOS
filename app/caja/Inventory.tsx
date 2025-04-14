import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useAccount } from '../../context/AccountContext';
import { useRouter } from 'expo-router';
import { cajeroInventoryStyles } from '../../Styles/caja/Inventory';
 
// Función auxiliar para calcular totales (similar a la de la pantalla de caja)
const calculateTotals = (order: any) => {
  const subtotal = order.items?.reduce(
    (sum: number, item: any) => sum + parseFloat(item.price) * (item.quantity || 1),
    0
  ) || 0;
  const tax = subtotal * 0.10;
  const total = subtotal + tax;
  return { subtotal, tax, total };
};
 
const Inventory = () => {
  const { getInventoryOrders } = useAccount();
  const router = useRouter();
  const [inventoryOrders, setInventoryOrders] = useState<any[]>([]);
 
  // Carga las órdenes del inventario en tiempo real (o por petición)
  const loadInventoryOrders = async () => {
    try {
      const orders = await getInventoryOrders();
      setInventoryOrders(orders);
    } catch (error) {
      console.error('Error al cargar órdenes del inventario:', error);
    }
  };
 
  useEffect(() => {
    loadInventoryOrders();
  }, []);
 
  // Renderizado de cada orden pagada
  const renderInventoryCard = ({ item }: { item: any }) => {
    const { subtotal, tax, total } = calculateTotals(item);
    // Se asume que el campo "paidAt" viene en formato Timestamp de Firebase
    const paidDate = item.paidAt ? new Date(item.paidAt.seconds * 1000) : new Date();
    const formattedDate = paidDate.toLocaleDateString() + ' ' + paidDate.toLocaleTimeString();
 
    return (
      <View style={cajeroInventoryStyles.orderCard}>
        <Text style={cajeroInventoryStyles.orderCardTitle}>Mesa: {item.table}</Text>
        <Text style={cajeroInventoryStyles.orderCardSubtitle}>Fecha de Pago: {formattedDate}</Text>
        <ScrollView style={cajeroInventoryStyles.itemsContainer}>
          {item.items?.map((prod: any, index: number) => (
            <View key={index} style={cajeroInventoryStyles.itemRow}>
              <Text style={cajeroInventoryStyles.itemText}>{prod.title}</Text>
              <Text style={cajeroInventoryStyles.itemText}>x{prod.quantity || 1}</Text>
              <Text style={cajeroInventoryStyles.itemText}>$ {parseFloat(prod.price).toFixed(2)}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={cajeroInventoryStyles.totalsContainer}>
          <Text style={cajeroInventoryStyles.totalText}>Subtotal: ${subtotal.toFixed(2)}</Text>
          <Text style={cajeroInventoryStyles.totalText}>Tax (10%): ${tax.toFixed(2)}</Text>
          <Text style={[cajeroInventoryStyles.totalText, { fontWeight: 'bold' }]}>Total: ${total.toFixed(2)}</Text>
        </View>
      </View>
    );
  };
 
  return (
    <View style={cajeroInventoryStyles.container}>
      <View style={cajeroInventoryStyles.header}>
        <Text style={cajeroInventoryStyles.greeting}>Inventario de Pagos</Text>
        <TouchableOpacity onPress={() => router.push('/caja')}>
          <Image source={require('../../assets/images/home.png')} style={cajeroInventoryStyles.iconHeader} />
        </TouchableOpacity>
      </View>
      <View style={cajeroInventoryStyles.body}>
        {inventoryOrders.length === 0 ? (
          <Text style={cajeroInventoryStyles.noOrdersText}>No hay órdenes pagadas disponibles</Text>
        ) : (
          <FlatList
            data={inventoryOrders}
            keyExtractor={(item) => item.id}
            renderItem={renderInventoryCard}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        )}
      </View>
      <View style={cajeroInventoryStyles.footer}>
        <TouchableOpacity onPress={() => router.push('/caja')}>
          <Image source={require('../../assets/images/inventario.png')} style={cajeroInventoryStyles.iconFooter} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/caja')}>
          <Image source={require('../../assets/images/home.png')} style={cajeroInventoryStyles.iconFooter} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Image source={require('../../assets/images/out.png')} style={cajeroInventoryStyles.iconFooter} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
 
export default Inventory;
