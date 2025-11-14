import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axiosClient";

const UsuarioProgreso = () => {
  const { id } = useParams();
  const [progreso, setProgreso] = useState({});
  const [usuario, setUsuario] = useState(null); // 👈 Nuevo estado
  const [loading, setLoading] = useState(true);

  const cargarProgreso = async () => {
    try {
      const res = await api.get(`/progreso/${id}`);
      setProgreso(res.data.progreso || {});
      setUsuario(res.data.usuario || null);
    } catch (error) {
      console.error("Error al cargar progreso del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProgreso();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        Cargando progreso...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Progreso del Estudiante
          </h2>
          <Link
            to="/dashboard/usuarios"
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            ← Volver
          </Link>
        </div>

        {/* 🔹 Mostrar datos del estudiante */}
        {usuario && (
          <div className="mb-6 border-b pb-4">
            <p className="text-lg font-semibold text-gray-800">
              {usuario.nombre}
            </p>
            <p className="text-gray-600">{usuario.correo}</p>
          </div>
        )}

        {Object.keys(progreso).length === 0 ? (
          <p className="text-center text-gray-600 py-8">
            No hay progreso registrado aún para este usuario.
          </p>
        ) : (
          Object.entries(progreso).map(([materia, temas]) => (
            <div key={materia} className="mb-8">
              <h3 className="text-xl font-semibold mb-3">{materia}</h3>

              {Object.entries(temas).map(([tema, subtemas]) => (
                <div key={tema} className="bg-gray-50 border rounded-lg mb-4 p-4">
                  <h4 className="text-lg font-medium text-gray-800 mb-2">
                    Tema: {tema}
                  </h4>

                  {Object.entries(subtemas).map(([subtema, ejercicios]) => (
                    <div
                      key={subtema}
                      className="mb-3 border-l-4 border-blue-400 pl-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-700">
                          Subtema: {subtema}
                        </h5>
                      </div>

                      <table className="w-full text-sm border border-gray-200">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="p-2 text-left">Pregunta</th>
                            <th className="p-2 text-left">Respuesta</th>
                            <th className="p-2 text-left">Retroalimentación</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ejercicios.map((e, index) => (
                            <tr
                              key={index}
                              className="border-t hover:bg-gray-100 transition"
                            >
                              <td className="p-2">{e.pregunta}</td>
                              <td className="p-2">{e.respuestaUsuario}</td>
                              <td className="p-2">{e.retroalimentacion}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UsuarioProgreso;
