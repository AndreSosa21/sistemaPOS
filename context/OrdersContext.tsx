import React, { createContext, useContext, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../utils/FireBaseConfig';

const OrdersContext = createContext<any>(null);

export const OrdersProvider = ({ children }: any) => {
  const [cart, setCart] = useState<any[]>([]);  // Almacena los productos en el carrito
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const addToCart = (item: any) => {
    setCart(prevCart => [...prevCart, item]);
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
