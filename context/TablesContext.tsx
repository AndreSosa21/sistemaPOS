import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { db } from '../utils/FireBaseConfig';
import { collection, onSnapshot, getDocs, addDoc } from 'firebase/firestore';

export type TableStatus = 'Available' | 'Occupied';

export interface Table {
  id: string;
  name: string;
  status: TableStatus;
}

interface TableContextProps {
  tables: Table[];
  updateTableStatus: (tableId: string, status: TableStatus) => void;
}

const TableContext = createContext<TableContextProps>({
  tables: [],
  updateTableStatus: () => {},
});

export const TableProvider = ({ children }: { children: ReactNode }) => {
  // Mesas por defecto
  const initialTables: Table[] = [
    { id: 'T-1', name: 'T-1', status: 'Available' },
    { id: 'T-2', name: 'T-2', status: 'Available' },
    { id: 'T-3', name: 'T-3', status: 'Available' },
    { id: 'T-4', name: 'T-4', status: 'Available' },
    { id: 'T-5', name: 'T-5', status: 'Available' },
    { id: 'T-6', name: 'T-6', status: 'Available' },
  ];

  const [tables, setTables] = useState<Table[]>(initialTables);

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
