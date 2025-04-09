import React, { createContext, useContext, useState } from 'react';

export type TableStatus = 'Available' | 'Occupied';

export interface Table {
  name: string;
  status: TableStatus;
}

interface TableContextProps {
  tables: Table[];
  updateTableStatus: (tableName: string, status: TableStatus) => void;
}

const TableContext = createContext<TableContextProps | undefined>(undefined);

export const TableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Se inicializan las mesas T-1 a T-6 en estado Available
  const [tables, setTables] = useState<Table[]>([
    { name: 'T-1', status: 'Available' },
    { name: 'T-2', status: 'Available' },
    { name: 'T-3', status: 'Available' },
    { name: 'T-4', status: 'Available' },
    { name: 'T-5', status: 'Available' },
    { name: 'T-6', status: 'Available' },
  ]);

  const updateTableStatus = (tableName: string, status: TableStatus) => {
    setTables(prev =>
      prev.map(table =>
        table.name === tableName ? { ...table, status } : table
      )
    );
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
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};
