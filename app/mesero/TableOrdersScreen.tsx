// app/mesero/TableOrdersScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
  // Usamos useRouter para obtener los parámetros de la URL
import { db } from '../../utils/FireBaseConfig';  // Asegúrate de tener la configuración de Firebase
import { collection, query, where, getDocs } from 'firebase/firestore';
import { tableOrdersStyles } from '../../Styles/mesero/index';  // Estilos para la pantalla

const TableOrdersScreen = () => {
  const router = useRouter();
  const { table } = useLocalSearchParams();  // Obtiene el número de mesa desde los parámetros de la URL
  const [orders, setOrders] = useState<any[]>([]);  // Almacena las órdenes asociadas a la mesa seleccionada
  const [loading, setLoading] = useState<boolean>(true);  // Para mostrar un mensaje de carga

  // Función para obtener las órdenes de la mesa desde Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), where('table', '==', table));  // Filtra las órdenes por número de mesa
        const snapshot = await getDocs(q);
        const ordersData = snapshot.docs.map((doc) => doc.data());
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        setLoading(false);
      }
    };

    if (table) {  // Asegúrate de que el número de mesa esté disponible
      fetchOrders();
    }
  }, [table]);

  return (
    <View style={tableOrdersStyles.container}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Órdenes de la mesa {table}
      </Text>

      {/* Si se está cargando las órdenes, muestra un mensaje */}
      {loading ? (
        <Text style={{ color: 'gray' }}>Cargando órdenes...</Text>
      ) : (
        // Si hay órdenes, se muestra la lista
        <FlatList
          data={orders}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={tableOrdersStyles.orderContainer}>
              <Text style={tableOrdersStyles.itemText}>Mesa: {item.table}</Text>
              <Text style={tableOrdersStyles.itemText}>Total: ${item.total}</Text>
              <Text style={tableOrdersStyles.itemText}>Fecha: {item.createdAt.toDate().toLocaleString()}</Text>
              <Text style={tableOrdersStyles.itemText}>Productos:</Text>
              {item.items.map((dish: any, idx: number) => (
                <Text key={idx} style={tableOrdersStyles.itemText}>
                  • {dish.title} - ${dish.price}
                </Text>
              ))}
            </View>
          )}
        />
      )}

      {/* Botón para regresar */}
      <TouchableOpacity onPress={() => window.history.back()} style={tableOrdersStyles.backButton}>
        <Text style={tableOrdersStyles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TableOrdersScreen;
