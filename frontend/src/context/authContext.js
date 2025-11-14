import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axiosClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Cargar sesión desde AsyncStorage al iniciar la app
  useEffect(() => {
    verificarSesion();
  }, []);

  const verificarSesion = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser)); // Usuario completo
      }
    } catch (e) {
      console.log("Error verificando sesión:", e);
    }
    setCargando(false);
  };

  const login = async (correo, password) => {
    try {
      const res = await api.post("/usuarios/login", { correo, password });

      const token = res.data.token;
      const usuario = res.data.usuario; // EL BACKEND DEBE MANDARLO

      // Guardar token y usuario
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(usuario));

      setUser(usuario);

      return { ok: true };
    } catch (error) {
      console.log("Error login:", error.response?.data || error);
      return {
        ok: false,
        msg: error.response?.data?.msg || "Error al iniciar sesión",
      };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, cargando, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
