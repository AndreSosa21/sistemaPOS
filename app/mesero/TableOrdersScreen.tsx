import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../utils/FireBaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useTable } from '../../context/TablesContext'; // Importamos el useTable hook
import { tableOrdersStyles } from '../../Styles/mesero/index';

const TableOrdersScreen = () => {
  const router = useRouter();
  const { table } = useLocalSearchParams();
  const { tables } = useTable(); // Obtenemos las mesas desde el contexto
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), where('table', '==', table));
        const snapshot = await getDocs(q);
        const ordersData = snapshot.docs.map((doc) => doc.data());
        setOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        setLoading(false);
      }
    };

    if (table) {
      fetchOrders();
    }

    // Función para actualizar el tiempo de las órdenes cada segundo
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          const currentTime = new Date();
          const orderTime = order.createdAt.toDate(); // Convertir a objeto Date
          const timeDiffInMs = currentTime.getTime() - orderTime.getTime(); // Diferencia en milisegundos

          // Calcular horas, minutos y segundos
          const hours = Math.floor(timeDiffInMs / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiffInMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiffInMs % (1000 * 60)) / 1000);

          // Crear un formato adecuado: "hh:mm:ss"
          const timeElapsed = `${hours}:${minutes}:${seconds}`;
          return { ...order, timeElapsed };
        })
      );
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(interval); // Limpiar intervalo al desmontar el componente
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
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
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

      {/* Mostrar el estado de la mesa con un color */}
      <View
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: tableData?.status === 'Available' ? 'green' : 'red',
        }}
      >
        <Text style={{ color: 'white' }}>
          Mesa {tableData?.name} está {tableData?.status}
        </Text>
      </View>
    </View>
  );
};

export default TableOrdersScreen;
