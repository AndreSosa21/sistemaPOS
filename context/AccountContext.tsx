// ===============================================================
// Archivo: context/AccountContext.tsx
// Propósito: Proveer funciones relacionadas con las cuentas, en particular
// la gestión del pago de órdenes (marcar como pagado, mover a inventary y liberar mesas).
// ===============================================================

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
// Se importa useTable para actualizar el estado de las mesas
import { useTable } from './TablesContext';

// Se crea el contexto para la cuenta
const AccountContext = createContext<any>(null);

export const AccountProvider = ({ children }: any) => {
  // Se obtiene la función updateTableStatus desde el contexto de mesas
  const { updateTableStatus } = useTable();

  /**
   * markOrderAsPaid
   *
   * Realiza los siguientes pasos:
   * 1. Actualiza el estado de la orden a "pagado" en la colección "orders".
   * 2. Copia la orden a la colección "inventary" (se crea si no existe) y agrega el campo paidAt.
   * 3. Elimina la orden de la colección "orders".
   * 4. Libera la mesa asociada (cambia su estado a "Available").
   */
  const markOrderAsPaid = async (orderId: string) => {
    try {
      console.log('[AccountContext] Iniciando markOrderAsPaid para orderId:', orderId);
      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        console.warn('[AccountContext] La orden no existe, abortando proceso.');
        return;
      }

      const orderData = orderSnap.data();
      console.log('[AccountContext] Datos de la orden:', orderData);

      // 1. Actualizar estado a "pagado"
      await updateDoc(orderRef, { orderStatus: 'pagado' });
      console.log('[AccountContext] Estado de la orden actualizado a "pagado".');

      // 2. Copiar la orden a la colección "inventary"
      const inventaryRef = collection(db, 'inventary');
      await addDoc(inventaryRef, {
        ...orderData,
        orderStatus: 'pagado',
        paidAt: new Date(),
      });
      console.log('[AccountContext] Orden copiada a la colección "inventary".');

      // 3. Eliminar la orden de "orders"
      await deleteDoc(orderRef);
      console.log('[AccountContext] Orden eliminada de la colección "orders".');

      // 4. Liberar la mesa asociada (si aplica)
      if (orderData.table) {
        await updateTableStatus(orderData.table, 'Available');
        console.log('[AccountContext] Mesa liberada:', orderData.table);
      }
    } catch (error) {
      console.error('[AccountContext] Error en markOrderAsPaid:', error);
      throw error;
    }
  };

  // Función para obtener todas las órdenes almacenadas en "inventary"
  const getInventoryOrders = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'inventary'));
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('[AccountContext] Error al obtener inventary:', error);
      throw error;
    }
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
