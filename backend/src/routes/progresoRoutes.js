import express from "express";
import {
  responderEjercicio,
  obtenerProgresoUsuario,
  obtenerEstadisticasProgreso,
  responderEjercicioMateria,
  obtenerProgresoPorDocumento,
} from "../controllers/progresoController.js";
import { protegerRuta } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/responder", protegerRuta, responderEjercicio);
router.post("/ejercicio", protegerRuta,responderEjercicioMateria);
router.get("/:id",protegerRuta, obtenerProgresoUsuario);
router.get("/usuario/estadisticas", protegerRuta, obtenerEstadisticasProgreso);
router.get("/usuario/:id",protegerRuta,obtenerProgresoPorDocumento);

export default router;
