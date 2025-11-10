import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosClient";

const UsuarioCrear = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("estudiante");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/usuarios", {
        nombre,
        correo,
        password,
        rol,
      });

      alert("Usuario creado correctamente:", res.data);
      navigate("/dashboard/usuarios");
    } catch (err) {
      console.error("Error al crear usuario:", err);
      setError(err.response?.data?.msg || "Error al crear usuario.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Crear Usuario</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Correo:</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Rol:</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="estudiante">Estudiante</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsuarioCrear;
