import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UsuariosLista from "./pages/Usuarios/UsuariosLista";
import UsuarioCrear from "./pages/Usuarios/UsuarioCrear";
import UsuarioEditar from "./pages/Usuarios/UsuarioEditar";
import MateriasLista from "./pages/Materias/MateriasLista";
import MateriaCrear from "./pages/Materias/MateriaCrear";
import MateriaEditar from "./pages/Materias/MateriaEditar";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard protegido */}
        <Route
          path="/dashboard/*"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        >
          <Route path="usuarios" element={<UsuariosLista />} />
          <Route path="usuarios/crear" element={<UsuarioCrear />} />
          <Route path="usuarios/editar/:id" element={<UsuarioEditar />} />

          <Route path="materias" element={<MateriasLista />} />
          <Route path="materias/crear" element={<MateriaCrear />} />
          <Route path="materias/editar/:id" element={<MateriaEditar />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
