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
