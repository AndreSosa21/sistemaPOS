// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { CrudProvider } from '../context/CrudContext';
import { OrdersProvider } from '../context/OrdersContext';
import { TableProvider } from '../context/TablesContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CrudProvider>
        <OrdersProvider>
          <TableProvider>
            <Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="mesero" />
              <Stack.Screen name="chef" />
              <Stack.Screen name="cajero" />
              <Stack.Screen name="admin" />
            </Stack>
          </TableProvider>
        </OrdersProvider>
      </CrudProvider>
    </AuthProvider>
  );
}
