import express from "express";
import { protegerRuta } from "../middlewares/authMiddleware.js";
import { generarPreguntasHandler ,obtenerPreguntas} from "../controllers/preguntaController.js";

const router = express.Router();

router.post("/generar-preguntas", protegerRuta, generarPreguntasHandler);
router.get("/preguntas",protegerRuta,obtenerPreguntas)

export default router;
