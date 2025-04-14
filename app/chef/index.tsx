import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../../utils/FireBaseConfig";
import { useRouter } from "expo-router";
import styles from "../../Styles/chef";
import { AuthContext } from "../../context/AuthContext";

export default function ChefScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();
  const { userType, email } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Recuperar las órdenes desde Firestore y almacenar el id del documento
  useEffect(() => {
    const q = collection(db, "orders");

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersData = querySnapshot.docs.map((docItem) => ({
        createdAt: docItem.data().createdAt,
        ...docItem.data(),
        id: docItem.id,
      }));
      setOrders(ordersData);
    }, (error) => {
      console.error("Error al obtener las órdenes: ", error);
    });

    // Limpiar el listener al desmontar el componente
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (email) {
      const user = email.split('@')[0];
      setUsername(user);
    }
  }, [userType, email]);

  // Función para actualizar el estado de la orden
  const updateOrderStatus = async (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    let newStatus = order.orderStatus;
    if (order.orderStatus === "pendiente") {
      newStatus = "preparando";
    } else if (order.orderStatus === "preparando") {
      newStatus = "listo";
    } else if (order.orderStatus === "listo") {
      newStatus = "entregado";
    } else if (order.orderStatus === "entregado") {
      return; // No se actualiza si ya está entregado
    }

    try {
      // Actualizar en Firestore usando el id del documento
      await updateDoc(doc(db, "orders", orderId), {
        orderStatus: newStatus,
      });
      const updatedOrder = { ...order, orderStatus: newStatus };
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)));
    } catch (error) {
      console.error("Error al actualizar la orden: ", error);
    }
  };

  // Función para obtener el color del botón según el estado de la orden
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "#D9534F"; // Rojo
      case "preparando":
        return "#F0AD4E"; // Amarillo
      case "listo":
        return "#006400"; // Verde oscuro
      case "entregado":
        return "#90EE90"; // Verde claro
      default:
        return "#DDD";
    }
  };

  // Función para formatear la diferencia de tiempo en hh:mm:ss
  const formatTimeDiff = (createdAt: any) => {
    // Se asume que createdAt es un Timestamp de Firebase. Si no, se puede ajustar.
    let startDate: Date;
    if (createdAt?.toDate) {
      startDate = createdAt.toDate();
    } else if (createdAt?.seconds) {
      startDate = new Date(createdAt.seconds * 1000);
    } else {
      startDate = new Date();
    }
    const diff = currentTime.getTime() - startDate.getTime();
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Renderizado de cada orden en la lista
  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.orderItem}>
      {/* Nombre de la mesa */}
      <Text style={styles.orderTitle}>Mesa: {item.table}</Text>

      {/* Lista de platos */}
      <View style={styles.dishesList}>
        {item.items.map((dish: any, index: number) => (
          <Text key={index} style={styles.dishText}>
            {dish.title}
          </Text>
        ))}
      </View>

      {/* Botón que muestra y actualiza el estado de la orden */}
      <TouchableOpacity
        style={[styles.statusButton, { backgroundColor: getStatusColor(item.orderStatus) }]}
        onPress={() => updateOrderStatus(item.id)}
      >
        <Text style={styles.statusButtonText}>
          {item.orderStatus === "pendiente"
            ? "Pendiente"
            : item.orderStatus === "preparando"
            ? "Preparando"
            : item.orderStatus === "listo"
            ? "Listo"
            : "Entregado"}
        </Text>
      </TouchableOpacity>

      {/* Tiempo transcurrido actualizado */}
      <Text style={styles.timeText}>
        Tiempo transcurrido: {formatTimeDiff(item.createdAt)} (hh:mm:ss)
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Cabecera */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello! {username} </Text>
        <TouchableOpacity onPress={() => router.push("/chef")}>
          <Image
            source={require("../../assets/images/campana.png")}
            style={styles.personaIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Lista de órdenes */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        renderItem={renderOrder}
      />

      {/* Footer fijo */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push("/chef")}>
          <Image
            source={require("../../assets/images/home.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/chef")}>
          <Image
            source={require("../../assets/images/chef.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Image
            source={require("../../assets/images/out.png")}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
