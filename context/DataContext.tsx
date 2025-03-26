// context/DataContext.tsx
import React, { createContext } from 'react';
import { db } from '../utils/FireBaseConfig';

export const DataContext = createContext<any>(null);

export const DataProvider = ({ children }: any) => {
  return (
    <DataContext.Provider value={{ db }}>
      {children}
    </DataContext.Provider>
  );
};
