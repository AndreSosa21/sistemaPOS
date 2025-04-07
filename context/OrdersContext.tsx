// context/OrdersContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../utils/FireBaseConfig';

const OrdersContext = createContext<any>(null);

export const OrdersProvider = ({ children }: any) => {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const addToCart = (item: any) => {
    setCart([...cart, item]);
  };

  const clearCart = () => {
    setCart([]);
    setSelectedTable(null);
  };

  const confirmOrder = async () => {
    const total = cart.reduce((acc, item) => acc + parseFloat(item.price), 0);
    const orderData = {
      table: selectedTable,
      items: cart,
      total,
      createdAt: new Date(),
    };
    await addDoc(collection(db, 'orders'), orderData);
    clearCart();
  };

  return (
    <OrdersContext.Provider
      value={{ cart, addToCart, selectedTable, setSelectedTable, confirmOrder }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
