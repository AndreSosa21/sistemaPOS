import React, { createContext, useContext, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../utils/FireBaseConfig';

const OrdersContext = createContext<any>(null);

export const OrdersProvider = ({ children }: any) => {
  const [cart, setCart] = useState<any[]>([]);  // Almacena los productos en el carrito
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const addToCart = (item: any) => {
    setCart((prevCart) => [...prevCart, item]);  // Añadir el producto al carrito
  };

  const clearCart = () => {
    setCart([]);  // Limpiar el carrito
    setSelectedTable(null);
  };

  const confirmOrder = async () => {
    const total = cart.reduce((acc, item) => acc + parseFloat(item.price), 0);  // Calcular total del carrito
    const orderData = {
      table: selectedTable,
      items: cart.map((item) => ({
        ...item,
        status: "pending", // Estado inicial de los platos
      })),
      total,
      createdAt: new Date(),
      status: 'creada',  // El estado inicial de la orden es "creada"
    };
    await addDoc(collection(db, 'orders'), orderData);  // Guardar la orden en Firestore
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
