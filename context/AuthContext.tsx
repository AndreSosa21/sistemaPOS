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
        getDoc(doc(db, "users", usr.uid))
          .then((docSnap) => {
            if (docSnap.exists()) {
              const userType = docSnap.data().userType;
              setUserType(userType);
              
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

  const login = async (email: string, password: string) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

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