import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    navigate("/");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-5">
        <h2 className="text-xl font-bold mb-6">Panel Administrador</h2>
        <nav className="flex-1">
          <ul>
            <li className="mb-2">
              <Link
                to="/dashboard/usuarios" // <-- ruta absoluta
                className="block px-3 py-2 rounded hover:bg-gray-700 transition"
              >
                Usuarios
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/materias" // <-- ruta absoluta
                className="block px-3 py-2 rounded hover:bg-gray-700 transition"
              >
                Materias
              </Link>
            </li>
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Cerrar Sesión
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
