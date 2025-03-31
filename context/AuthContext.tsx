// context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../utils/FireBaseConfig';
import { signInWithEmailAndPassword, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/FireBaseConfig';
import { useRouter } from 'expo-router';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userType, setUserType] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      if (usr) {
        // Obtiene el tipo de usuario desde Firestore
        getDoc(doc(db, "users", usr.uid))
          .then((docSnap) => {
            if (docSnap.exists()) {
              setUserType(docSnap.data().userType);
              // Redirige al usuario dependiendo de su tipo
              if (docSnap.data().userType === 'mesero') {
                router.replace('./app/mesero/index.tsx');
              } else if (docSnap.data().userType === 'chef') {
                router.replace('./app/chef/index.tsx');
              } else if (docSnap.data().userType === 'cajero') {
                router.replace('./app/caja/index.tsx');
              }
            }
          })
          .catch((error) => console.error('Error fetching user type:', error));
      }
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

  const register = async (userData: { email: string, password: string, userType: string }) => {
    // Registro de usuario ya hecho en el register.tsx
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setUserType('');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
