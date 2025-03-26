// context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../utils/FireBaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

export interface User {
  email: string;
  password: string;
  // puedes agregar más propiedades según tus necesidades
}

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const register = async (user: User) => {
    try {
      await createUserWithEmailAndPassword(auth, user.email, user.password);
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const role = () => {
    // Funcionalidad para roles, por implementar
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
