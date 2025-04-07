// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { CrudProvider } from '../context/CrudContext'; // Asegúrate de importar CrudProvider

export default function RootLayout() {
  return (
    <AuthProvider>
      <CrudProvider>
        <Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="mesero" />
          <Stack.Screen name="chef" />
          <Stack.Screen name="cajero" />
          <Stack.Screen name="admin" />
           {/* Pantallas internas del mesero */}
           <Stack.Screen name="mesero/OrdersScreen" />
            <Stack.Screen name="mesero/CartScreen" />
            <Stack.Screen name="mesero/ProfileScreen" />
            <Stack.Screen name="mesero/TableOrdersScreen" />
        </Stack>
      </CrudProvider>
    </AuthProvider>
  );
}
