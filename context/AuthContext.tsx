import { createContext } from "react";
import { User } from "../interfaces/common";

export const AuthContext = createContext({})
export const AuthProvider = ({children}: any) => {
    const login =(email: string, password: string) => {

    }
    const register = (
       user: User
    ) => {

    }

    const role = () => {

    }
    
    const logout = () => {

    }
  return (
    <AuthContext.Provider 
        value={{
            login,
            register,
            role,
            logout
        }}>
      {children}
    </AuthContext.Provider>
  )
}