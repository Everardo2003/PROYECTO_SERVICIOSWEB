import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axiosClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    verificarSesion();
  }, []);

  const verificarSesion = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) setUser({ token });
    } catch (e) {
      console.log("Error verificando sesión:", e);
    }
    setCargando(false);
  };

  const login = async (correo, password) => {
    try {
      const res = await api.post("/usuarios/login", {
        correo,
        password,
      });

      const token = res.data.token;
      await AsyncStorage.setItem("token", token);

      setUser(res.data.usuario);
      return { ok: true };
    } catch (error) {
      console.log(error.response?.data || error);
      return { ok: false, msg: error.response?.data?.msg || "Error al iniciar sesión" };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};
