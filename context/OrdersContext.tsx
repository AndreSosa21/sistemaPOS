import React, { createContext, useContext, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../utils/FireBaseConfig';

const OrdersContext = createContext<any>(null);

export const OrdersProvider = ({ children }: any) => {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

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

  const increaseQuantity = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    // Nota: no se borra la mesa aquí
  };

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
