import React, { createContext, useContext } from 'react';
import { db } from '../utils/FireBaseConfig';
import {
  doc,
  updateDoc,
  getDoc,
  addDoc,
  deleteDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { useTable } from './TablesContext';

const AccountContext = createContext<any>(null);

export const AccountProvider = ({ children }: any) => {
  const { updateTableStatus } = useTable();

  // ✅ Función para marcar una orden como pagada
  const markOrderAsPaid = async (orderId: string) => {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) return;

    const orderData = orderSnap.data();

    // 1. Actualizar estado a pagado
    await updateDoc(orderRef, { orderStatus: 'pagado' });

    // 2. Guardar copia en el inventario
    await addDoc(collection(db, 'inventory'), {
      ...orderData,
      orderStatus: 'pagado',
      paidAt: new Date(),
    });

    // 3. Eliminar orden activa (opcional)
    await deleteDoc(orderRef);

    // 4. Liberar mesa
    if (orderData.table) {
      updateTableStatus(orderData.table, 'Available');
    }
  };

  // ✅ Función para traer todas las órdenes del inventario
  const getInventoryOrders = async () => {
    const snapshot = await getDocs(collection(db, 'inventory'));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  return (
    <AccountContext.Provider
      value={{
        markOrderAsPaid,
        getInventoryOrders,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
