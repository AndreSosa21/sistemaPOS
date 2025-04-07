import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import chefStyles from "../../Styles/chef";
import { useRouter } from "expo-router"; // Usamos useRouter para la navegación

export default function ChefIndex() {
  const router = useRouter();  // Usamos useRouter para navegar a otras rutas

  // Simulando un listado de mesas con un ID
  const tables = [
    { id: "table1", name: "Table 1" },
    { id: "table2", name: "Table 2" },
    { id: "table3", name: "Table 3" },
  ];

  const handleViewOrder = (tableId: string) => {
    // Navegar a la página de órdenes pasando el id de la mesa como parámetro
    router.push(`/chef/ordenes?id=${tableId}`); // Pasamos el ID de la mesa
  };

  const renderTableItem = ({ item }: any) => (
    <View style={chefStyles.tableItem}>
      <Text style={chefStyles.tableText}>{item.name}</Text>
      <TouchableOpacity
        style={chefStyles.viewOrderButton}
        onPress={() => handleViewOrder(item.id)}  // Al hacer clic en la mesa, navegamos a las órdenes
      >
        <Text style={chefStyles.buttonText}>View Order</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={chefStyles.container}>
      <Text style={chefStyles.headerText}>Orders for Chef</Text>
      <FlatList
        data={tables}
        keyExtractor={(item) => item.id}
        renderItem={renderTableItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}
