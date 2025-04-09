import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useCrud } from '../../context/CrudContext';
import { useOrders } from '../../context/OrdersContext';
import { orderScreenStyles } from '../../Styles/mesero/OrderScreen';
import { useRouter } from 'expo-router';
import { useTable, Table } from '../../context/TablesContext';

const OrderScreen = () => {
  const { products } = useCrud();
  const { cart, addToCart, selectedTable, setSelectedTable, confirmOrder } = useOrders();
  const { tables, updateTableStatus } = useTable();
  const router = useRouter();

  // Renderizado de cada producto del menú
  const renderProduct = ({ item }: { item: any }) => (
    <View style={orderScreenStyles.productItem}>
      <Image source={{ uri: item.imageUrl }} style={orderScreenStyles.productImage} />
      <View style={orderScreenStyles.productDetails}>
        <Text style={orderScreenStyles.productTitle}>{item.title}</Text>
        <Text style={orderScreenStyles.productPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity style={orderScreenStyles.addButton} onPress={() => addToCart(item)}>
        <Text style={orderScreenStyles.addButtonText}>Añadir</Text>
      </TouchableOpacity>
    </View>
  );

  // Renderizado de cada mesa utilizando la información del TableContext
  const renderTable = (table: Table) => {
    let backgroundColor = table.status === 'Available' ? '#409744' : '#BA3A3A';
    if (selectedTable === table.name) {
      backgroundColor = '#F0AD4E'; // Amarillo si es la mesa seleccionada
    }
    return (
      <TouchableOpacity
        key={table.name}
        style={[orderScreenStyles.tableButton, { backgroundColor }]}
        onPress={() => setSelectedTable(table.name)}
      >
        <Text style={orderScreenStyles.tableButtonText}>{table.name}</Text>
      </TouchableOpacity>
    );
  };

  // Validación para confirmar la orden: debe haber una mesa seleccionada
  const handleConfirmOrder = async () => {
    if (!selectedTable) {
      Alert.alert('Error', 'Debe seleccionar una mesa para confirmar la orden.');
      return;
    }
    await confirmOrder();
    updateTableStatus(selectedTable, 'Occupied');
    Alert.alert('Éxito', 'Orden confirmada correctamente');
  };

  return (
    <ScrollView style={orderScreenStyles.container}>
      {/* Cabecera del menú */}
      <View style={orderScreenStyles.header}>
        <Text style={orderScreenStyles.headerText}>Menú del Restaurante</Text>
      </View>

      {/* Lista de productos */}
      <FlatList
        data={products}
        keyExtractor={(item) => (item.id ?? '').toString()}
        renderItem={renderProduct}
        contentContainerStyle={orderScreenStyles.productList}
        scrollEnabled={false}
      />

      {/* Separador visual */}
      <View style={orderScreenStyles.divider} />

      {/* Sección del carrito y selección de mesa */}
      <View style={orderScreenStyles.orderSection}>
        <Text style={orderScreenStyles.sectionTitle}>Carrito</Text>
        {cart.length === 0 ? (
          <Text style={orderScreenStyles.emptyCartText}>No hay productos en el carrito</Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={orderScreenStyles.cartItem}>
                <Text style={orderScreenStyles.cartItemText}>
                  {item.title} - ${item.price}
                </Text>
              </View>
            )}
          />
        )}

        <Text style={orderScreenStyles.sectionTitle}>Seleccione Mesa</Text>
        {/* Grilla de mesas utilizando el TableContext */}
        <View style={orderScreenStyles.tableGrid}>
          {tables.map((table) => renderTable(table))}
        </View>

        {/* Visualización de la mesa seleccionada */}
        <Text style={orderScreenStyles.selectedTableText}>
          Mesa Seleccionada: {selectedTable ? selectedTable : "Ninguna"}
        </Text>

        {/* Botón para confirmar la orden */}
        <TouchableOpacity style={orderScreenStyles.confirmButton} onPress={handleConfirmOrder}>
          <Text style={orderScreenStyles.confirmButtonText}>Confirmar Orden</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OrderScreen;
