import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";

const Login = () => {
  const navigate = useNavigate();
  const [credenciales, setCredenciales] = useState({ correo: "", password: "" });
  const [error, setError] = useState("");

  // Bloquear login si ya hay sesión activa
  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");
    if (token && rol === "admin") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/usuarios/login", credenciales);

      if (data.usuario.rol !== "admin") {
        setError("Solo el administrador puede acceder al sistema.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.usuario.rol);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Correo electrónico</label>
            <input
              type="email"
              name="correo"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Contraseña</label>
            <input
              type="password"
              name="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-400"
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm mb-3 text-center">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition cursor-pointer"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
