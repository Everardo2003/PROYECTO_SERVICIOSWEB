import express from "express";
import { generarPreguntas, generarRetroalimentacion } from '../services/gptService.js';
import { protegerRuta } from "../middlewares/authMiddleware.js";
import Materia from "../models/Materia.js";

const router = express.Router();

router.post("/generar-preguntas", protegerRuta, async (req, res) => {
  const { materiaId, temaIndex, cantidad } = req.body;

  try {
    const materia = await Materia.findById(materiaId);
    if (!materia) return res.status(404).json({ msg: "Materia no encontrada" });

    // Buscar tema por índice
    const tema = materia.temas[temaIndex];
    if (!tema) return res.status(404).json({ msg: "Tema no encontrado" });

    const preguntas = await generarPreguntas(materia, tema, cantidad || 3);
    res.json({ preguntas });
  } catch (error) {
    res.status(500).json({ msg: "Error generando preguntas", error });
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
