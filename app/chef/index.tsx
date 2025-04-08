import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../utils/FireBaseConfig";
import { useRouter } from "expo-router";
import styles from "../../Styles/chef";

export default function ChefScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  // Recuperar las órdenes desde Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const ordersData = querySnapshot.docs.map((docItem) => ({
          createdAt: docItem.data().createdAt,
          ...docItem.data(),
        }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error al obtener las órdenes: ", error);
      }
    };

    fetchOrders();
  }, []);

  // Función para actualizar el estado de un plato
  const updateDishStatus = async (orderId: string, dishIndex: number) => {
    const order = orders.find((o) => o.createdAt === orderId);
    if (!order) return;

    // Actualizar el estado del plato seleccionado
    const updatedItems = order.items.map((dish: any, index: number) => {
      if (index === dishIndex && dish.status === "pending") {
        return { ...dish, status: "in_process" }; // Cambiar a "in_process"
      }
      if (index === dishIndex && dish.status === "in_process") {
        return { ...dish, status: "prepared" }; // Cambiar a "prepared"
      }
      return dish;
    });

    const newOrderStatus = updatedItems.every((dish: any) => dish.status === "prepared")
      ? "preparado"
      : "pending";

    try {
      // Actualizar en Firestore
      await updateDoc(doc(db, "orders", orderId), {
        items: updatedItems,
        orderStatus: newOrderStatus,
      });
      const updatedOrder = { ...order, items: updatedItems, orderStatus: newOrderStatus };
      setOrders(orders.map((o) => (o.createdAt === orderId ? updatedOrder : o)));
    } catch (error) {
      console.error("Error al actualizar la orden: ", error);
    }
  };

  // Función para obtener el color según el estado del plato
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#D9534F"; // Rojo
      case "in_process":
        return "#F0AD4E"; // Amarillo
      case "prepared":
        return "#5BC0DE"; // Verde
      default:
        return "#DDD";
    }
  };

  // Renderizado de cada orden en la lista
  const renderOrder = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => router.push(`/chef?createdAt=${item.createdAt}`)}
    >
      <Text style={styles.orderTitle}>Mesa: {item.table}</Text>
      <Text style={styles.orderStatus}>Estado: {item.orderStatus}</Text>
      {item.items.map((dish: any, index: number) => (
        <View key={index} style={styles.dishItem}>
          <Text style={styles.dishText}>
            {dish.title} - 
            <Text
              style={{
                backgroundColor: getStatusColor(dish.status),
                color: "#FFF",
                padding: 5,
                borderRadius: 5,
              }}
            >
              {dish.status === "pending"
                ? "Pendiente"
                : dish.status === "in_process"
                ? "En Proceso"
                : "Preparado"}
            </Text>
          </Text>
          {dish.status === "pending" && (
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => updateDishStatus(item.createdAt, index)}
            >
              <Text style={styles.updateButtonText}>Marcar Hecho</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Cabecera */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello! Chef</Text>
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
        keyExtractor={(item) => item.createdAt.toString()}
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
        <TouchableOpacity onPress={() => router.push("/chef/platos")}>
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
