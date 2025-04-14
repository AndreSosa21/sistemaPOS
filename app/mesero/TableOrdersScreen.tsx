import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../utils/FireBaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore'; // Importamos onSnapshot
import { useTable } from '../../context/TablesContext'; // Importamos el useTable hook
import { tableOrdersStyles } from '../../Styles/mesero/index';

const TableOrdersScreen = () => {
  const router = useRouter();
  const { table } = useLocalSearchParams();
  const { tables } = useTable(); // Obtenemos las mesas desde el contexto
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Función para escuchar cambios en tiempo real
    const q = query(collection(db, 'orders'), where('table', '==', table));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => doc.data());
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error('Error al obtener las órdenes:', error);
      setLoading(false);
    });

    // Limpiar el listener al desmontar el componente
    return () => unsubscribe();
  }, [table]);

  // Buscar el estado de la mesa
  const tableData = tables.find((t) => t.id === table);

  // Agrupar productos con cantidades y total por producto
  const groupItems = (items: any[]) => {
    const grouped: { [title: string]: any } = {};

    items.forEach((item) => {
      const key = item.title;
      const price = parseFloat(item.price);
      if (grouped[key]) {
        grouped[key].quantity += 1;
        grouped[key].totalPrice += price;
      } else {
        grouped[key] = {
          title: item.title,
          description: item.description,
          quantity: 1,
          totalPrice: price,
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

      <TouchableOpacity onPress={() => router.back()} style={tableOrdersStyles.backButton}>
        <Text style={tableOrdersStyles.backButtonText}>Volver</Text>
      </TouchableOpacity>  
    </View>
  );
};

export default TableOrdersScreen;
