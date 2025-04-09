// app/mesero/OrdersScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView, Alert,
} from 'react-native';
import { useCrud } from '../../context/CrudContext';
import { useOrders } from '../../context/OrdersContext';
import { orderScreenStyles } from '../../Styles/mesero/OrderScreen';
import Toast from 'react-native-toast-message';
import { useTable, Table } from '../../context/TablesContext';

const OrdersScreen = () => {
  const { products } = useCrud();
  const { cart, addToCart, selectedTable, setSelectedTable, confirmOrder } = useOrders();
  const { tables, updateTableStatus } = useTable();
  const router = useRouter();

  const handleAddToCart = (product: any) => {
    const exists = cart.find((item: any) => item.id === product.id);
    if (exists) {
      increaseQuantity(product);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    Toast.show({
      type: 'success',
      text1: 'Producto añadido al carrito',
      text2: `${product.title} - $${product.price}`,
    });
  };

  const renderProduct = ({ item }: { item: any }) => {
    const itemInCart = cart.find((cartItem: any) => cartItem.id === item.id);
    const quantity = itemInCart?.quantity || 0;
    const totalPrice = quantity * item.price;

    return (
      <View style={orderScreenStyles.productItem}>
        <Image source={{ uri: item.imageUrl }} style={orderScreenStyles.productImage} />
        <View style={orderScreenStyles.productDetails}>
          <Text style={orderScreenStyles.productTitle}>
            {item.title} {quantity > 0 && `(${quantity})`}
          </Text>
          <Text style={orderScreenStyles.productPrice}>
            ${quantity > 0 ? totalPrice : item.price}
          </Text>
          <Text style={orderScreenStyles.productDescription}>{item.description}</Text>
        </View>
        <TouchableOpacity
          style={orderScreenStyles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={orderScreenStyles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={orderScreenStyles.cartItem}>
      <Text style={orderScreenStyles.cartItemText}>
        {item.title} ({item.quantity}) - ${item.quantity * item.price}
      </Text>
      <View style={orderScreenStyles.cartActions}>
        <TouchableOpacity onPress={() => decreaseQuantity(item)}>
          <Text style={orderScreenStyles.quantityButton}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => increaseQuantity(item)}>
          <Text style={orderScreenStyles.quantityButton}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleRemoveFromCart(item)}>
          <Text style={orderScreenStyles.removeButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
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

  // Validación para confirmar la orden
  const handleConfirmOrder = async () => {
    if (!selectedTable) {
      Alert.alert('Error', 'Debe seleccionar una mesa para confirmar la orden.');
      return;
    }
    // Confirmar la orden
    await confirmOrder();
    // Una vez confirmada la orden, actualizamos el estado de la mesa a Occupied
    await updateTableStatus(selectedTable, 'Occupied');
    Alert.alert('Éxito', 'Orden confirmada y mesa asignada como ocupada.');
  };

  return (
    <ScrollView style={orderScreenStyles.container}>
      <View style={orderScreenStyles.header}>
        <Text style={orderScreenStyles.headerText}>Menú del Restaurante</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id?.toString() || ''}
        renderItem={renderProduct}
        contentContainerStyle={orderScreenStyles.productList}
        scrollEnabled={false}
      />

      <View style={orderScreenStyles.divider} />

      <View style={orderScreenStyles.orderSection}>
        <Text style={orderScreenStyles.sectionTitle}>Carrito</Text>

        {cart.length === 0 ? (
          <Text style={orderScreenStyles.emptyCartText}>
            No hay productos en el carrito
          </Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
          />
        )}

        <Text style={orderScreenStyles.sectionTitle}>Seleccione Mesa</Text>
        <View style={orderScreenStyles.tableGrid}>
          {tables.map((table) => renderTable(table))}
        </View>

        <Text style={orderScreenStyles.selectedTableText}>
          Mesa Seleccionada: {selectedTable || 'Ninguna'}
        </Text>

        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
          Total: ${total.toFixed(2)}
        </Text>

        {/* Botón para confirmar la orden */}
        <TouchableOpacity style={orderScreenStyles.confirmButton} onPress={handleConfirmOrder}>
          <Text style={orderScreenStyles.confirmButtonText}>Confirmar Orden</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </ScrollView>
  );
};

export default OrdersScreen;
