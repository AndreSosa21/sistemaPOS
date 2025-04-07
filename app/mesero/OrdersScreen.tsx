// app/mesero/OrdersScreen.tsx
import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useCrud } from '../../context/CrudContext'; // Usamos el contexto de productos
import { useOrders } from '../../context/OrdersContext'; // Usamos el contexto de órdenes
import { menuStyles } from '../../Styles/mesero/index'; // Estilos de la pantalla
import { useRouter } from 'expo-router';

const OrdersScreen = () => {
  const { products } = useCrud(); // Obtiene los productos del CrudContext
  const { addToCart } = useOrders(); // Función para añadir productos al carrito
  const router = useRouter();

  // Función para añadir productos al carrito
  const handleAddToCart = (product: any) => {
    addToCart(product);  // Añadir el producto al carrito
    console.log('Producto añadido al carrito:', product);
  };

  return (
    <View style={menuStyles.container}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Menú del Restaurante
      </Text>
      <FlatList
        data={products}  // Usamos los productos obtenidos del contexto
        keyExtractor={(item) => (item.id ?? '').toString()}
        renderItem={({ item }) => (
          <View style={menuStyles.item}>
            <Image
              source={{ uri: item.imageUrl }}  // Carga la imagen desde la URL
              style={menuStyles.itemImage}  // Estilos para la imagen
            />
            <Text style={menuStyles.itemText}>{item.title} - ${item.price}</Text>
            <TouchableOpacity onPress={() => handleAddToCart(item)}>
              <Text style={menuStyles.addButton}>Añadir al carrito</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity
        onPress={() => router.push('/mesero/CartScreen')}
        style={menuStyles.cartButton}
      >
        <Text style={menuStyles.cartButtonText}>Ir al carrito</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrdersScreen;
