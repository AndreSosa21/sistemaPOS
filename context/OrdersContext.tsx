// ===============================================================
// Archivo: context/OrdersContext.tsx
// Propósito: Proveer funcionalidades relacionadas con la gestión
// de órdenes (carrito, cantidad de productos, selección de mesa, etc.).
// Incluye funciones para modificar el carrito y confirmar una orden.
// ===============================================================

import React, { createContext, useContext, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../utils/FireBaseConfig';

// Se crea el contexto para órdenes
const OrdersContext = createContext<any>(null);

export const OrdersProvider = ({ children }: any) => {
  // Estado para el carrito (lista de productos)
  const [cart, setCart] = useState<any[]>([]);
  // Estado para la mesa seleccionada, puede ser una cadena o null
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  // Función para añadir un producto al carrito; incrementa cantidad si ya existe
  const addToCart = (item: any) => {
    const existing = cart.find((p) => p.id === item.id);
    if (existing) {
      setCart((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  // Función para aumentar la cantidad de un producto en el carrito
  const increaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Función para disminuir la cantidad de un producto o eliminarlo si llega a cero
  const decreaseQuantity = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Función para remover un producto del carrito
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Función para limpiar el carrito (no borra la mesa)
  const clearCart = () => {
    setCart([]);
  };

  // Función para confirmar la orden:
  // Calcula el total, arma el objeto orderData, lo sube a Firestore y limpia el carrito.
  const confirmOrder = async () => {
    const total = cart.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );

    const orderData = {
      table: selectedTable,
      items: cart,
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
        setCart,
        selectedTable,
        setSelectedTable,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        confirmOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
