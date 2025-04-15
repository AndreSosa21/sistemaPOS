// ===============================================================
// Archivo: mesero/TableOrdersScreen.tsx
// Propósito: Pantalla que muestra todas las órdenes correspondientes 
// a una mesa específica. Se agrupan los ítems similares y se muestran
// detalles como fecha, total y estado de la orden.
// ===============================================================

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
// Hooks de Expo Router para navegación y obtención de parámetros de URL
import { useRouter, useLocalSearchParams } from 'expo-router';
// Importación de funciones de Firestore para consultas en tiempo real
import { db } from '../../utils/FireBaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
// Se utiliza el contexto de mesas para obtener los datos de mesas
import { useTable } from '../../context/TablesContext';
// Estilos específicos para la pantalla de órdenes por mesa
import { tableOrdersStyles } from '../../Styles/mesero/index';

const TableOrdersScreen = () => {
  const router = useRouter();
  // Se obtiene el parámetro 'table' de la URL
  const { table } = useLocalSearchParams();
  // Se obtienen las mesas desde el contexto
  const { tables } = useTable();
  // Estado para almacenar las órdenes de la mesa
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Escucha en tiempo real las órdenes que correspondan a la mesa indicada
  useEffect(() => {
    const q = query(collection(db, 'orders'), where('table', '==', table));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => doc.data());
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error('Error al obtener las órdenes:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [table]);

  // Busca la información de la mesa en el array de mesas
  const tableData = tables.find((t) => t.id === table);

  // Función para agrupar los ítems de una orden por título
  const groupItems = (items: any[]) => {
    const grouped: { [title: string]: any } = {};

    items.forEach((item) => {
      const key = item.title;
      const price = parseFloat(item.price);
      const quantity = item.quantity || 1;

      if (grouped[key]) {
        grouped[key].quantity += quantity;
        grouped[key].totalPrice += price * quantity;
      } else {
        grouped[key] = {
          title: item.title,
          description: item.description,
          quantity: quantity,
          totalPrice: price * quantity,
        };
      }
    });

    return Object.values(grouped);
  };

  return (
    <View style={tableOrdersStyles.container}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 80, textAlign: 'center' }}>
        Órdenes de la mesa {table}
      </Text>

      {loading ? (
        <Text style={{ color: 'gray' }}>Cargando órdenes...</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            const groupedItems = groupItems(item.items);
            return (
              <View style={tableOrdersStyles.orderContainer}>
                <Text style={tableOrdersStyles.itemText}>Mesa: {item.table}</Text>
                <Text style={tableOrdersStyles.itemText}>Total: ${item.total.toLocaleString()}</Text>
                <Text style={tableOrdersStyles.itemText}>
                  Fecha: {item.createdAt.toDate().toLocaleString()}
                </Text>
                <Text style={tableOrdersStyles.itemText}>
                  Estado: {item.orderStatus}
                </Text>
                <Text style={tableOrdersStyles.itemText}>
                  Tiempo transcurrido: {item.timeElapsed} (hh:mm:ss)
                </Text>
                <Text style={tableOrdersStyles.itemText}>Productos:</Text>
                {groupedItems.map((dish: any, idx: number) => (
                  <View key={idx} style={{ marginBottom: 6 }}>
                    <Text style={tableOrdersStyles.itemText}>
                      • {dish.title} ({dish.quantity}) - ${dish.totalPrice.toLocaleString()}
                    </Text>
                    {dish.description && (
                      <Text style={{ color: '#777', fontSize: 13, marginLeft: 10 }}>
                        {dish.description}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            );
          }}
        />
      )}

      {/* Botón para regresar a la pantalla anterior */}
      <TouchableOpacity onPress={() => router.back()} style={tableOrdersStyles.backButton}>
        <Text style={tableOrdersStyles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TableOrdersScreen;