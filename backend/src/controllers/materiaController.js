import Materia from '../models/Materia.js';

export const crearMateria = async (req, res) => {
  try {
    const nuevaMateria = new Materia(req.body);
    await nuevaMateria.save();
    res.status(201).json(nuevaMateria);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear materia', error });
  }
};

export const obtenerMaterias = async (req, res) => {
  const materias = await Materia.find();
  res.json(materias);
};

//Eliminar materia
export const eliminarMateria = async (req, res) => {
  try {
    const materia = await Materia.findById(req.params.id);
    if (!materia) return res.status(404).json({ msg: "Materia no encontrada" });

    await materia.deleteOne();
    res.status(200).json({ msg: "Materia eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar materia:", error);
    res.status(500).json({ msg: "Error al eliminar materia", error });
  }
};

//Actualizar materia
export const actualizarMateria = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, temas } = req.body;

  try {
    const materia = await Materia.findById(id);
    if (!materia) {
      return res.status(404).json({ msg: "Materia no encontrada" });
    }

    // 🔹 Actualizar campos generales
    if (nombre) materia.nombre = nombre;
    if (descripcion) materia.descripcion = descripcion;

    // 🔹 Si se envían temas
    if (temas && Array.isArray(temas)) {
      temas.forEach((temaActualizado) => {
        const temaExistente = materia.temas.find(
          (t) => t.nombre === temaActualizado.nombre
        );

        // Si el tema existe → actualizarlo
        if (temaExistente) {
          if (temaActualizado.contenido)
            temaExistente.contenido = temaActualizado.contenido;

          // 🔸 Actualizar subtemas si vienen
          if (temaActualizado.subtemas && Array.isArray(temaActualizado.subtemas)) {
            temaActualizado.subtemas.forEach((subtemaNuevo) => {
              const subtemaExistente = temaExistente.subtemas?.find(
                (s) => s.nombre === subtemaNuevo.nombre
              );

              if (subtemaExistente) {
                // Actualizar contenido del subtema
                if (subtemaNuevo.contenido)
                  subtemaExistente.contenido = subtemaNuevo.contenido;
              } else {
                // Agregar nuevo subtema
                temaExistente.subtemas.push(subtemaNuevo);
              }
            });
          }

          // 🔸 Agregar nuevos ejercicios sin borrar los existentes
          if (temaActualizado.ejercicios && Array.isArray(temaActualizado.ejercicios)) {
            temaActualizado.ejercicios.forEach((nuevoEj) => {
              const existe = temaExistente.ejercicios.some(
                (e) => e.pregunta === nuevoEj.pregunta
              );
              if (!existe) {
                temaExistente.ejercicios.push(nuevoEj);
              }
            });
          }
        } else {
          // Si el tema no existe → agregarlo nuevo
          materia.temas.push(temaActualizado);
        }
      });
    }

    await materia.save();

    res.status(200).json({
      msg: "Materia actualizada parcialmente con éxito",
      materia,
    });
  } catch (error) {
    console.error("Error actualizando materia:", error);
    res.status(500).json({ msg: "Error al actualizar materia", error });
  }
};

