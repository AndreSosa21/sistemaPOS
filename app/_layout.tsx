// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { CrudProvider } from '../context/CrudContext'; // Asegúrate de importar CrudProvider
import { OrdersProvider } from '../context/OrdersContext'; 
import { TableProvider } from '../context/TablesContext'; // Asegúrate de importar TablesProvider
import { AccountProvider } from '../context/AccountContext';  // <-- Asegúrate de importar AccountProvider

export default function RootLayout() {
  return (
    <AuthProvider>
      <CrudProvider>
        <OrdersProvider>
          <TableProvider>
            <AccountProvider>
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
