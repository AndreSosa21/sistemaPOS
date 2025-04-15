// ===============================================================
// Archivo: chef/index
// Propósito: Pantalla para el Chef, que muestra en tiempo real 
// las órdenes filtradas por estado, permite actualizar el estado
// de las órdenes y muestra el tiempo transcurrido desde su creación.
// ===============================================================

import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, ScrollView } from "react-native";
// Funciones de Firestore para escucha en tiempo real y actualización de documentos
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
// Configuración de la base de datos Firebase
import { db } from "../../utils/FireBaseConfig";
// Hook para navegación con Expo Router
import { useRouter } from "expo-router";
// Importación de estilos para Chef
import styles from "../../Styles/chef/index";
// Uso del contexto de autenticación para obtener información del usuario
import { AuthContext } from "../../context/AuthContext";

// Lista de estados que se usarán en esta pantalla (excluye "pagado")
const ESTADOS_CHEF = ["todos", "pendiente", "preparando", "listo", "entregado"];

const ChefScreen = () => {
  // Estado para almacenar la lista de órdenes obtenidas en tiempo real
  const [orders, setOrders] = useState<any[]>([]);
  // Estado para el filtro seleccionado; por defecto "todos"
  const [filter, setFilter] = useState("todos");
  // Hook para navegación
  const router = useRouter();
  // Extraer datos de usuario desde el contexto de autenticación
  const { userType, email } = useContext(AuthContext);
  // Estado para almacenar un nombre de usuario extraído del email
  const [username, setUsername] = useState("");
  // Estado para almacenar y actualizar el tiempo actual, usado para calcular el tiempo transcurrido
  const [currentTime, setCurrentTime] = useState(new Date());

  // Se actualiza el estado 'currentTime' cada segundo para mostrar el tiempo transcurrido
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Listener en tiempo real para obtener todas las órdenes desde Firestore
  useEffect(() => {
    const q = collection(db, "orders");
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        // Se mapean los documentos para incluir su id y datos
        const ordersData = querySnapshot.docs.map((docItem) => ({
          ...docItem.data(),
          id: docItem.id,
        }));
        setOrders(ordersData);
      },
      (error) => {
        console.error("Error al obtener las órdenes: ", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Extraer el nombre de usuario a partir del email
  useEffect(() => {
    if (email) {
      const user = email.split("@")[0];
      setUsername(user);
    }
  }, [userType, email]);

  // Función para actualizar el estado de una orden al presionar el botón
  const updateOrderStatus = async (orderId: string) => {
    // Busca la orden correspondiente en el array
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    let newStatus = order.orderStatus;
    // Lógica para actualizar el estado: pendiente -> preparando -> listo -> entregado
    if (order.orderStatus === "pendiente") {
      newStatus = "preparando";
    } else if (order.orderStatus === "preparando") {
      newStatus = "listo";
    } else if (order.orderStatus === "listo") {
      newStatus = "entregado";
    } else if (order.orderStatus === "entregado") {
      return; // Si ya es "entregado", no se actualiza
    }
    try {
      // Actualiza el documento en Firestore con el nuevo estado
      await updateDoc(doc(db, "orders", orderId), {
        orderStatus: newStatus,
      });
      // Actualiza el estado local para reflejar el cambio
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

  // Función para formatear el tiempo transcurrido desde la creación de la orden
  const formatTimeDiff = (createdAt: any) => {
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
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Se filtran las órdenes con base en el filtro seleccionado
  const filteredOrders =
    filter === "todos" ? orders : orders.filter((o) => o.orderStatus === filter);

  // Renderiza cada elemento de la lista de órdenes
  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderTitle}>Mesa: {item.table}</Text>
      <View style={styles.dishesList}>
        {item.items.map((dish: any, index: number) => (
          <Text key={index} style={styles.dishText}>
            {dish.quantity} x {dish.title}
          </Text>
        ))}
      </View>
      {/* Botón con color según el estado; al presionarlo se actualiza el estado */}
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
      {/* Muestra el tiempo transcurrido desde la creación de la orden */}
      <Text style={styles.timeText}>
        Tiempo transcurrido: {formatTimeDiff(item.createdAt)} (hh:mm:ss)
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header con saludo y notificación */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello! {username}</Text>
        <TouchableOpacity onPress={() => router.push("/chef")}>
          <Image
            source={require("../../assets/images/campana.png")}
            style={styles.personaIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Filtros de órdenes con scroll horizontal */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.filtersContainer}
      >
        {ESTADOS_CHEF.map((estado) => (
          <TouchableOpacity
            key={estado}
            onPress={() => setFilter(estado)}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  filter === estado ? getStatusColor(estado) : "#e0e0e0",
              },
            ]}
          >
            <Text style={styles.filterButtonText}>
              {estado.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de órdenes filtradas */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        renderItem={renderOrder}
      />

      {/* Footer con botones de navegación */}
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
};

export default ChefScreen;
