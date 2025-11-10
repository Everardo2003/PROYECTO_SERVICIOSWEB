import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axiosClient";

const UsuariosLista = () => {
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = async () => {
    try {
      const res = await api.get("/usuarios");
      setUsuarios(res.data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const eliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        await api.delete(`/usuarios/${id}`);
        cargarUsuarios();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
      }
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Lista de Usuarios</h2>
          <Link
            to="/dashboard/usuarios/crear"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded transition"
          >
            + Crear Usuario
          </Link>
        </div>

        {usuarios.length === 0 ? (
          <p className="text-gray-600 text-center py-6">
            No hay usuarios registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white text-left">
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Correo</th>
                  <th className="p-3">Rol</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, index) => (
                  <tr
                    key={u._id}
                    className={`border-b hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    <td className="p-3 font-medium text-gray-800">{u.nombre}</td>
                    <td className="p-3 text-gray-600">{u.correo}</td>
                    <td className="p-3 capitalize text-gray-700">{u.rol}</td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      <Link
                        to={`/dashboard/usuarios/editar/${u._id}`}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded transition"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => eliminar(u._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsuariosLista;
