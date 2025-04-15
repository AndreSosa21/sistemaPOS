// Importación de React y componentes necesarios de Expo Router y Contextos
import React from 'react';
import { Stack } from 'expo-router';
// Contextos de autenticación y de manejo de datos (CRUD, orders, tables, account)
import { AuthProvider } from '../context/AuthContext';
import { CrudProvider } from '../context/CrudContext'; // Asegúrate de importar CrudProvider
import { OrdersProvider } from '../context/OrdersContext'; 
import { TableProvider } from '../context/TablesContext'; // Asegúrate de importar TablesProvider
import { AccountProvider } from '../context/AccountContext';  // <-- Asegúrate de importar AccountProvider

// Componente raíz del layout, que provee varios providers para el manejo de estado global y rutas de la app
export default function RootLayout() {
  return (
    // Se envuelven los componentes con diferentes contextos para poder compartir información (autenticación, datos, etc.)
    <AuthProvider>
      <CrudProvider>
        <OrdersProvider>
          <TableProvider>
            <AccountProvider>
              {/* Stack de Expo Router para manejar las diferentes pantallas de la aplicación */}
              <Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
                <Stack.Screen name="mesero" />
                <Stack.Screen name="chef" />
                <Stack.Screen name="cajero" />
                <Stack.Screen name="admin" />
              </Stack>
            </AccountProvider>
          </TableProvider>
        </OrdersProvider>  
      </CrudProvider>
    </AuthProvider>
  );
}
