// ===============================================================
// Archivo: context/DataContext.tsx
// Propósito: Proveer acceso al objeto de base de datos (db) de Firebase
// mediante un contexto simple, para centralizar su uso en la aplicación.
// ===============================================================

import React, { createContext } from 'react';
import { db } from '../utils/FireBaseConfig';

// Se crea el contexto para Data
export const DataContext = createContext<any>(null);

// Componente proveedor que entrega el objeto db a sus descendientes
export const DataProvider = ({ children }: any) => {
  return (
    <DataContext.Provider value={{ db }}>
      {children}
    </DataContext.Provider>
  );
};
