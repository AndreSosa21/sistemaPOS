import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useCrud } from '../../context/CrudContext';
import { useOrders } from '../../context/OrdersContext';
import { orderScreenStyles } from '../../Styles/mesero/OrderScreen';
import { useRouter } from 'expo-router';

const OrderScreen = () => {
  const { products } = useCrud();
  const { cart, addToCart, selectedTable, setSelectedTable, confirmOrder, setCart } = useOrders();
  const router = useRouter();

  // Listado predeterminado de mesas de T-1 a T-6
  const tables = ["T-1", "T-2", "T-3", "T-4", "T-5", "T-6"];

  // Función para eliminar un producto del carrito (solo a nivel visual)
  const handleRemoveFromCart = (item: any) => {
    setCart((prevCart: any[]) => prevCart.filter(cartItem => cartItem.id !== item.id));
  };

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

  // Renderizado de cada mesa
  const renderTable = (tableLabel: string) => (
    <TouchableOpacity
      key={tableLabel}
      style={[
        orderScreenStyles.tableButton,
        selectedTable === tableLabel && orderScreenStyles.tableButtonSelected,
      ]}
      onPress={() => setSelectedTable(tableLabel)}
    >
      <Text style={orderScreenStyles.tableButtonText}>{tableLabel}</Text>
    </TouchableOpacity>
  );

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
                <TouchableOpacity 
                  style={orderScreenStyles.removeButton} 
                  onPress={() => handleRemoveFromCart(item)}
                >
                  <Text style={orderScreenStyles.removeButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <Text style={orderScreenStyles.sectionTitle}>Seleccione Mesa</Text>
        {/* Grilla de mesas */}
        <View style={orderScreenStyles.tableGrid}>
          {tables.map((table) => renderTable(table))}
        </View>

        {/* Visualización de la mesa seleccionada */}
        <Text style={orderScreenStyles.selectedTableText}>
          Mesa Seleccionada: {selectedTable ? selectedTable : "Ninguna"}
        </Text>

        {/* Botón para confirmar la orden */}
        <TouchableOpacity style={orderScreenStyles.confirmButton} onPress={confirmOrder}>
          <Text style={orderScreenStyles.confirmButtonText}>Confirmar Orden</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OrderScreen;
