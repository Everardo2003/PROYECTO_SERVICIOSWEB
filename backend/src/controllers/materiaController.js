import Materia from '../models/Materia.js';
import mongoose from "mongoose";

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

export const actualizarMateria = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, temas } = req.body;

  try {
    const materia = await Materia.findById(id);
    if (!materia) {
      return res.status(404).json({ msg: "Materia no encontrada" });
    }

    // Actualizar campos básicos
    materia.nombre = nombre ?? materia.nombre;
    materia.descripcion = descripcion ?? materia.descripcion;

    // 🔹 Validar y actualizar estructura anidada de temas
    if (Array.isArray(temas)) {
      materia.temas = temas.map((tema) => ({
        nombre: tema.nombre ?? "",
        contenido: tema.contenido ?? "",
        subtemas: Array.isArray(tema.subtemas)
          ? tema.subtemas.map((sub) => ({
            nombre: sub.nombre ?? "",
            contenido: sub.contenido ?? "",
            ejercicios: Array.isArray(sub.ejercicios)
              ? sub.ejercicios.map((ej) => ({
                pregunta: ej.pregunta ?? "",
                opciones: ej.opciones ?? [],
                respuestaCorrecta: ej.respuestaCorrecta ?? "",
              }))
              : [],
          }))
          : [],
      }));
    }

    await materia.save();

    res.status(200).json({
      msg: "Materia actualizada correctamente",
      materia,
    });
  } catch (error) {
    console.error("Error actualizando materia:", error);
    res.status(500).json({
      msg: "Error al actualizar materia",
      error: error.message,
    });
  }
};

export const obtenerMateriaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const materia = await Materia.findById(id);

    if (!materia) {
      return res.status(404).json({ msg: "Materia no encontrada" });
    }

    res.status(200).json(materia);
  } catch (error) {
    console.error("Error al obtener materia:", error);
    res.status(500).json({ msg: "Error al obtener materia", error });
  }
};

export const obtenerSubtemasPorId = async (req, res) => {
  try {
        const { id } = req.params;

        // Buscar en TODAS las materias al tema que coincida
        const materia = await Materia.findOne({ "temas._id": id });

        if (!materia) {
            return res.status(404).json({
                ok: false,
                msg: "Tema no encontrado",
            });
        }

        // Buscar el tema
        const tema = materia.temas.id(id);

        return res.json({
            ok: true,
            subtemas: tema.subtemas,
        });

    } catch (error) {
        console.error("Error al obtener subtemas:", error);
        return res.status(500).json({
            ok: false,
            msg: "Error en el servidor",
        });
    }


};



