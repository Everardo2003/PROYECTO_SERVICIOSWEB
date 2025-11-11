import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosClient";

const MateriaEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const temaRef = useRef(null);

  const [materia, setMateria] = useState({
    nombre: "",
    descripcion: "",
    temas: [],
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarMateria = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMensaje("No hay token. Inicia sesión nuevamente.");
          navigate("/login");
          return;
        }

        const { data } = await api.get("/materias", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const materiaEncontrada = data.find((m) => m._id === id);
        if (!materiaEncontrada) {
          setMensaje("Materia no encontrada.");
          navigate("/dashboard/materias");
          return;
        }

        setMateria(materiaEncontrada);
      } catch (error) {
        console.error("Error al cargar materia:", error);
        setMensaje("Error al cargar la materia.");
      }
    };
    cargarMateria();
  }, [id, navigate]);

  // Cambiar valores de campos principales
  const handleChange = (e) =>
    setMateria({ ...materia, [e.target.name]: e.target.value });

  // Cambiar valores dentro de un tema
  const handleTemaChange = (i, e) => {
    const nuevos = [...materia.temas];
    nuevos[i][e.target.name] = e.target.value;
    setMateria({ ...materia, temas: nuevos });
  };

  // Cambiar valores dentro de un subtema
  const handleSubtemaChange = (temaIndex, subtemaIndex, e) => {
    const nuevos = [...materia.temas];
    nuevos[temaIndex].subtemas[subtemaIndex][e.target.name] = e.target.value;
    setMateria({ ...materia, temas: nuevos });
  };

  // Cambiar valores dentro de un ejercicio
  const handleEjercicioChange = (temaIndex, ejercicioIndex, e) => {
    const nuevos = [...materia.temas];
    nuevos[temaIndex].ejercicios[ejercicioIndex][e.target.name] =
      e.target.value;
    setMateria({ ...materia, temas: nuevos });
  };

  // Agregar tema
  const agregarTema = () => {
    setMateria({
      ...materia,
      temas: [
        ...materia.temas,
        { nombre: "", contenido: "", subtemas: [], ejercicios: [] },
      ],
    });
    setTimeout(() => temaRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // Eliminar tema
  const eliminarTema = (i) => {
    if (confirm("¿Seguro de eliminar este tema?")) {
      setMateria({ ...materia, temas: materia.temas.filter((_, x) => x !== i) });
    }
  };

  // Agregar subtema
  const agregarSubtema = (i) => {
    const nuevos = [...materia.temas];
    nuevos[i].subtemas.push({ nombre: "", contenido: "" });
    setMateria({ ...materia, temas: nuevos });
  };

  // Eliminar subtema
  const eliminarSubtema = (ti, si) => {
    if (confirm("¿Seguro de eliminar este subtema?")) {
      const nuevos = [...materia.temas];
      nuevos[ti].subtemas = nuevos[ti].subtemas.filter((_, x) => x !== si);
      setMateria({ ...materia, temas: nuevos });
    }
  };

  // Agregar ejercicio
  const agregarEjercicio = (i) => {
    const nuevos = [...materia.temas];
    nuevos[i].ejercicios.push({ pregunta: "" });
    setMateria({ ...materia, temas: nuevos });
  };

  // Eliminar ejercicio
  const eliminarEjercicio = (ti, ei) => {
    if (confirm("¿Seguro de eliminar este ejercicio?")) {
      const nuevos = [...materia.temas];
      nuevos[ti].ejercicios = nuevos[ti].ejercicios.filter((_, x) => x !== ei);
      setMateria({ ...materia, temas: nuevos });
    }
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return setMensaje("Error: No hay token.");

      await api.put(
        `/materias/${id}`,
        {
          nombre: materia.nombre,
          descripcion: materia.descripcion,
          temas: materia.temas,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Materia actualizada correctamente");
      navigate("/dashboard/materias");
    } catch (error) {
      console.error("Error al actualizar:", error);
      setMensaje("Error al actualizar la materia.");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Editar Materia</h2>
        </div>

        {mensaje && (
          <div className="text-center bg-blue-50 border border-blue-200 text-blue-700 py-2 rounded mb-6">
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={materia.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={materia.descripcion}
              onChange={handleChange}
            />
          </div>

          {/* Temas */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Temas</h3>
            <button
              type="button"
              onClick={agregarTema}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition"
            >
              + Agregar Tema
            </button>
          </div>

          <div ref={temaRef} className="space-y-4 mt-4">
            {materia.temas.map((tema, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-700">
                    Tema {i + 1}: {tema.nombre || "Sin título"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => eliminarTema(i)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-md transition"
                  >
                    Eliminar
                  </button>
                </div>

                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre del tema"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
                  value={tema.nombre}
                  onChange={(e) => handleTemaChange(i, e)}
                />
                <textarea
                  name="contenido"
                  placeholder="Contenido del tema"
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
                  value={tema.contenido}
                  onChange={(e) => handleTemaChange(i, e)}
                />

                {/* Subtemas */}
                <div className="mb-4">
                  <h5 className="text-gray-700 font-medium mb-2">Subtemas</h5>
                  {tema.subtemas.map((sub, si) => (
                    <div
                      key={si}
                      className="bg-white border border-gray-200 rounded-lg p-3 mb-2"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">
                          Subtema {si + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => eliminarSubtema(i, si)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5 rounded transition"
                        >
                          X
                        </button>
                      </div>
                      <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre del subtema"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1 mb-2"
                        value={sub.nombre}
                        onChange={(e) => handleSubtemaChange(i, si, e)}
                      />
                      <textarea
                        name="contenido"
                        placeholder="Contenido del subtema"
                        rows="2"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1"
                        value={sub.contenido}
                        onChange={(e) => handleSubtemaChange(i, si, e)}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => agregarSubtema(i)}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    + Agregar Subtema
                  </button>
                </div>

                {/* Ejercicios */}
                <div>
                  <h5 className="text-gray-700 font-medium mb-2">Ejercicios</h5>
                  {tema.ejercicios.map((ej, ei) => (
                    <div
                      key={ei}
                      className="bg-white border border-gray-200 rounded-lg p-3 mb-2"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">
                          Ejercicio {ei + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => eliminarEjercicio(i, ei)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-0.5 rounded transition"
                        >
                          X
                        </button>
                      </div>
                      <input
                        type="text"
                        name="pregunta"
                        placeholder="Pregunta"
                        className="w-full border border-gray-300 rounded-lg px-3 py-1"
                        value={ej.pregunta}
                        onChange={(e) => handleEjercicioChange(i, ei, e)}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => agregarEjercicio(i)}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    + Agregar Ejercicio
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MateriaEditar;
