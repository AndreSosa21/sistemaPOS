// context/TableContext.tsx
import React, { createContext, useContext, useState } from 'react';

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

export const TableProvider = ({ children }: { children: React.ReactNode }) => {
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
    setTables(prevTables =>
      prevTables.map(table =>
        table.id === tableId ? { ...table, status } : table
      )
    );
  };

  return (
    <TableContext.Provider value={{ tables, updateTableStatus }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => useContext(TableContext);
