import express from "express";
import { protegerRuta } from "../middlewares/authMiddleware.js";
import { generarPreguntasHandler } from "../controllers/preguntaController.js";

const router = express.Router();

router.post("/generar-preguntas", protegerRuta, generarPreguntasHandler);

export default router;
