import React, { createContext, useContext, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../utils/FireBaseConfig';

const OrdersContext = createContext<any>(null);

export const OrdersProvider = ({ children }: any) => {
  const [cart, setCart] = useState<any[]>([]);  // Almacena los productos en el carrito
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // Añadir producto al carrito
  const addToCart = (item: any) => {
    setCart(prevCart => [...prevCart, item]);
  };

  const removeFromCart = (item: any, removeCompletely: boolean) => {
    setCart((prevCart: any) => {
      return prevCart.reduce((acc: any, cartItem: any) => {
        if (cartItem.id === item.id) {
          if (removeCompletely) {
            // Eliminar el producto completamente si la cantidad llega a 0
            return acc;
          } else {
            // Restar 1 de la cantidad del producto
            cartItem.quantity -= 1;
            // Si la cantidad es mayor que 0, lo agregamos de nuevo al carrito
            if (cartItem.quantity > 0) {
              acc.push(cartItem);
            }
          }
        } else {
          acc.push(cartItem);
        }
        return acc;
      }, []);
    });
  };  

  const clearCart = () => {
    setCart([]);
    setSelectedTable(null);
  };

  const confirmOrder = async () => {
    const total = cart.reduce((acc, item) => acc + parseFloat(item.price), 0);
    const orderData = {
      table: selectedTable,
      items: cart, // Sin estado individual para cada plato
      total,
      createdAt: new Date(),
      orderStatus: 'pendiente',
    };
    await addDoc(collection(db, 'orders'), orderData);
    clearCart();
  };

  return (
    <OrdersContext.Provider
      value={{
        cart,
        addToCart,
        setCart,           // Agregado para poder modificar el carrito desde OrderScreen
        removeFromCart,    // Función para eliminar productos o disminuir su cantidad
        selectedTable,
        setSelectedTable,
        confirmOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
