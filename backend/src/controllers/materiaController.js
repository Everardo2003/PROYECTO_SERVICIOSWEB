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

    // Actualizar los campos si vienen en el body
    if (nombre) materia.nombre = nombre;
    if (descripcion) materia.descripcion = descripcion;
    if (temas) materia.temas = temas;

    await materia.save();

    res.status(200).json({ msg: "Materia actualizada correctamente", materia });
  } catch (error) {
    console.error("Error actualizando materia:", error);
    res.status(500).json({ msg: "Error al actualizar materia", error });
  }
};
