import express from "express";
import { generarPreguntas } from "../services/gptService.js";
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

export default router;
