import { createContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      obtenerPerfil();
    } else {
      setCargando(false);
    }
  }, []);

  const obtenerPerfil = async () => {
    try {
      const { data } = await axiosClient.get("/usuarios");
      setUsuario(data);
    } catch (error) {
      console.error("Error obteniendo perfil:", error);
      logout();
    } finally {
      setCargando(false);
    }
  };

  const login = async (correo, password) => {
    try {
      const { data } = await axiosClient.post("/usuarios/login", {
        correo,
        password,
      });
      localStorage.setItem("token", data.token);
      setUsuario(data.usuario);
      return true;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};
