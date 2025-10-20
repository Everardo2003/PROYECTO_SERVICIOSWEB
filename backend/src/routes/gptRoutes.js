import express from "express";
import { generarPreguntas, generarRetroalimentacion } from '../services/gptService.js';
import { protegerRuta } from "../middlewares/authMiddleware.js";
import Materia from "../models/Materia.js";

const router = express.Router();

router.post("/generar-preguntas", protegerRuta, async (req, res) => {
  try {
    const { materiaId, temaIndex, cantidad } = req.body;

    if (materiaId === undefined || temaIndex === undefined) {
      return res.status(400).json({ msg: "Faltan parámetros obligatorios" });
    }

    // 1️⃣ Buscar materia
    const materia = await Materia.findById(materiaId);
    if (!materia) return res.status(404).json({ msg: "Materia no encontrada" });

    // 2️⃣ Validar índice del tema
    if (temaIndex < 0 || temaIndex >= materia.temas.length) {
      return res.status(404).json({ msg: "Tema no encontrado" });
    }

    const tema = materia.temas[temaIndex];

    // 3️⃣ Generar preguntas con la IA y guardar en MongoDB
    const preguntas = await generarPreguntas(materiaId, temaIndex, cantidad || 3);

    // 4️⃣ Devolver preguntas
    res.status(200).json({
      msg: "Preguntas generadas y guardadas correctamente",
      preguntas,
    });

  } catch (error) {
    console.error("Error en /generar-preguntas:", error);
    res.status(500).json({
      msg: "Error generando preguntas",
      error: error.message,
    });
  }
});

router.post('/retroalimentar', async (req, res) => {
  try {
    const { pregunta, respuestaUsuario, respuestaCorrecta, tema } = req.body;

    if (!pregunta || !respuestaUsuario || !respuestaCorrecta) {
      return res.status(400).json({ msg: 'Faltan datos en la solicitud' });
    }

    const retroalimentacion = await generarRetroalimentacion(
      pregunta,
      respuestaUsuario,
      respuestaCorrecta,
      tema
    );
    console.log("Retroalimentación generada:", retroalimentacion);
    res.json({ retroalimentacion });
  } catch (error) {
    console.error('Error generando retroalimentación:', error);
    res.status(500).json({ msg: 'Error generando retroalimentación', error });
  }
});



export default router;
