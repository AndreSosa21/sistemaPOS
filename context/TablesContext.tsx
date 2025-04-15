// ===============================================================
// Archivo: context/TablesContext.tsx
// Propósito: Proveer la gestión de mesas en el sistema.
// Permite actualizar el estado de las mesas, inicializar las mesas
// en Firebase en caso de estar vacías y escuchar cambios en la colección
// "orders" para actualizar el estado de las mesas (Available/Occupied).
// ===============================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { db } from '../utils/FireBaseConfig';
import { collection, onSnapshot, getDocs, addDoc } from 'firebase/firestore';

// Definición de los posibles estados de mesa
export type TableStatus = 'Available' | 'Occupied';

// Interfaz para representar una mesa
export interface Table {
  id: string;
  name: string;
  status: TableStatus;
}

// Define las propiedades del contexto de mesas
interface TableContextProps {
  tables: Table[];
  updateTableStatus: (tableId: string, status: TableStatus) => void;
}

// Se crea el contexto con valores por defecto
const TableContext = createContext<TableContextProps>({
  tables: [],
  updateTableStatus: () => {},
});

export const TableProvider = ({ children }: { children: ReactNode }) => {
  // Se definen mesas iniciales por defecto
  const initialTables: Table[] = [
    { id: 'T-1', name: 'T-1', status: 'Available' },
    { id: 'T-2', name: 'T-2', status: 'Available' },
    { id: 'T-3', name: 'T-3', status: 'Available' },
    { id: 'T-4', name: 'T-4', status: 'Available' },
    { id: 'T-5', name: 'T-5', status: 'Available' },
    { id: 'T-6', name: 'T-6', status: 'Available' },
  ];

  // Estado para almacenar la lista de mesas
  const [tables, setTables] = useState<Table[]>(initialTables);

  // Función para actualizar el estado de una mesa
  const updateTableStatus = (tableId: string, status: TableStatus) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId ? { ...table, status } : table
      )
    );
  };

  // ➤ Inicialización de la colección "tables" en Firebase
  // Se consulta la colección y si está vacía se crean las mesas por defecto.
  useEffect(() => {
    const initTables = async () => {
      try {
        const tablesCollection = collection(db, 'tables');
        const snapshot = await getDocs(tablesCollection);
        if (snapshot.empty) {
          for (const table of initialTables) {
            // Se crean los documentos usando el objeto (se asignará un id automático)
            await addDoc(tablesCollection, { name: table.name, status: table.status });
          }
        }
      } catch (error) {
        console.error("Error inicializando las mesas:", error);
      }
    };
    initTables();
  }, []);

  // ➤ Escuchar cambios en las órdenes en tiempo real para actualizar el estado de las mesas.
  // Se marca la mesa como "Occupied" si existe alguna orden activa (estado distinto a "listo" o "entregado")
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const activeTables: Record<string, boolean> = {};

      snapshot.forEach((doc) => {
        const order = doc.data();
        const tableId = order.table;
        const status = order.orderStatus; // Se espera que los estados sean en minúsculas: "pendiente", "preparando", etc.
        if (status !== 'listo' && status !== 'entregado') {
          activeTables[tableId] = true;
        }
      });

      setTables((prevTables) =>
        prevTables.map((table) => ({
          ...table,
          status: activeTables[table.id] ? 'Occupied' : 'Available',
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <TableContext.Provider value={{ tables, updateTableStatus }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => useContext(TableContext);
