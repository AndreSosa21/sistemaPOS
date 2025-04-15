// ===============================================================
// Archivo: context/AuthContext.tsx
// Propósito: Proveer funciones y estado para la autenticación de usuarios,
// incluyendo el login, logout y la asignación de roles al usuario.
// ===============================================================

import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../utils/FireBaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/FireBaseConfig';
import { useRouter } from 'expo-router';

// Se crea el contexto de autenticación
export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  // Estado para almacenar el usuario de Firebase
  const [user, setUser] = useState<FirebaseUser | null>(null);
  // Estado para almacenar el tipo de usuario (rol)
  const [userType, setUserType] = useState<string>('');
  const router = useRouter();

  // onAuthStateChanged se utiliza para detectar cambios en la sesión del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      if (usr) {
        getDoc(doc(db, "users", usr.uid))
          .then((docSnap) => {
            if (docSnap.exists()) {
              const userType = docSnap.data().userType;
              setUserType(userType);
              
              // Redirige a la pantalla correspondiente según el rol del usuario
              switch(userType) {
                case 'mesero':
                  router.push('/mesero');
                  break;
                case 'chef':
                  router.push('/chef');
                  break;
                case 'cajero':
                  router.push('/caja');
                  break;
                case 'admin':
                  router.push('/admin');
                  break;
                default:
                  router.push('/login');
              }
            }
          })
          .catch((error) => console.error('Error obteniendo rol:', error));
      }
    });
    return () => unsubscribe();
  }, []);

  // Función para iniciar sesión mediante email y contraseña
  const login = async (email: string, password: string) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  // Función para cerrar sesión y redirigir a la pantalla de login
  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setUserType('');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        email: user?.email || '',
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
