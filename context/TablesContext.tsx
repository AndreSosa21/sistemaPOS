import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../utils/FireBaseConfig';

export type TableStatus = 'Available' | 'Occupied';

export interface Table {
  name: string;
  status: TableStatus;
}

interface TableContextProps {
  tables: Table[];
  updateTableStatus: (tableName: string, status: TableStatus) => Promise<void>;
}

const TableContext = createContext<TableContextProps | undefined>(undefined);

export const TableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    const tablesRef = collection(db, "tables");
    const unsubscribe = onSnapshot(tablesRef, async (snapshot) => {
      if (snapshot.empty) {
        // Si no existen mesas en la colección, se crean las iniciales:
        const initialTables: Table[] = [
          { name: 'T-1', status: 'Available' },
          { name: 'T-2', status: 'Available' },
          { name: 'T-3', status: 'Available' },
          { name: 'T-4', status: 'Available' },
          { name: 'T-5', status: 'Available' },
          { name: 'T-6', status: 'Available' },
        ];
        for (const table of initialTables) {
          await setDoc(doc(tablesRef, table.name), table);
        }
        setTables(initialTables);
      } else {
        const tableList = snapshot.docs.map((docItem) => docItem.data() as Table);
        setTables(tableList);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateTableStatus = async (tableName: string, status: TableStatus) => {
    try {
      const tableDocRef = doc(db, "tables", tableName);
      await updateDoc(tableDocRef, { status });
    } catch (error) {
      console.error("Error updating table status:", error);
    }
  };

  return (
    <TableContext.Provider value={{ tables, updateTableStatus }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTable must be used within a TableProvider");
  }
  return context;
};
