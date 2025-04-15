// ===============================================================
// Archivo: caja/inventary
// Propósito: Pantalla de Inventario del Cajero. Muestra un listado 
// de órdenes pagadas, incluyendo detalles como mesa, fecha de pago, 
// productos ordenados y totales (subtotal, impuestos y total). Se utiliza 
// para consultar las órdenes finalizadas.
// ===============================================================

import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native';
// Obtiene órdenes de inventario mediante una función del contexto de cuenta
import { useAccount } from '../../context/AccountContext';
// Hook para navegación con Expo Router
import { useRouter } from 'expo-router';
// Importación de estilos específicos para la pantalla de inventario
import { cajeroInventoryStyles } from '../../Styles/caja/Inventory';

// Función auxiliar para calcular los totales de una orden (subtotal, impuestos y total)
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
  // Obtiene la función para traer órdenes pagadas desde el contexto de cuenta
  const { getInventoryOrders } = useAccount();
  const router = useRouter();
  // Estado para almacenar las órdenes de inventario
  const [inventoryOrders, setInventoryOrders] = useState<any[]>([]);

  // Función que carga las órdenes del inventario (por petición o en tiempo real)
  const loadInventoryOrders = async () => {
    try {
      const orders = await getInventoryOrders();
      setInventoryOrders(orders);
    } catch (error) {
      console.error('Error al cargar órdenes del inventario:', error);
    }
  };

  // Se carga el inventario al montar el componente
  useEffect(() => {
    loadInventoryOrders();
  }, []);

  // Renderiza cada tarjeta de orden pagada con sus detalles
  const renderInventoryCard = ({ item }: { item: any }) => {
    const { subtotal, tax, total } = calculateTotals(item);
    // Se formatea la fecha de pago a partir del Timestamp de Firebase
    const paidDate = item.paidAt ? new Date(item.paidAt.seconds * 1000) : new Date();
    const formattedDate = paidDate.toLocaleDateString() + ' ' + paidDate.toLocaleTimeString();

    return (
      <View style={cajeroInventoryStyles.orderCard}>
        <Text style={cajeroInventoryStyles.orderCardTitle}>Mesa: {item.table}</Text>
        <Text style={cajeroInventoryStyles.orderCardSubtitle}>Fecha de Pago: {formattedDate}</Text>
        {/* Se muestra la lista de productos en un ScrollView */}
        <ScrollView style={cajeroInventoryStyles.itemsContainer}>
          {item.items?.map((prod: any, index: number) => (
            <View key={index} style={cajeroInventoryStyles.itemRow}>
              <Text style={cajeroInventoryStyles.itemText}>{prod.title}</Text>
              <Text style={cajeroInventoryStyles.itemText}>x{prod.quantity || 1}</Text>
              <Text style={cajeroInventoryStyles.itemText}>$ {parseFloat(prod.price).toFixed(2)}</Text>
            </View>
          ))}
        </ScrollView>
        {/* Sección de totales de la orden */}
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
      {/* Header con título y botón para regresar a la pantalla de caja */}
      <View style={cajeroInventoryStyles.header}>
        <Text style={cajeroInventoryStyles.greeting}>Inventario de Pagos</Text>
        <TouchableOpacity onPress={() => router.push('/caja')}>
          <Image source={require('../../assets/images/home.png')} style={cajeroInventoryStyles.iconHeader} />
        </TouchableOpacity>
      </View>
      {/* Cuerpo: si no hay órdenes, se muestra un mensaje; de lo contrario, se lista con FlatList */}
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
      {/* Footer con botones para navegar entre secciones */}
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
