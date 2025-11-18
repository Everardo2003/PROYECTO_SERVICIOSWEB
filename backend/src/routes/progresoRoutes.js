import express from "express";
import {
  responderEjercicio,
  obtenerProgresoUsuario,
  obtenerEstadisticasProgreso,
  responderEjercicioMateria
} from "../controllers/progresoController.js";
import { protegerRuta } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/responder", protegerRuta, responderEjercicio);
router.post("/ejercicio", protegerRuta,responderEjercicioMateria);
router.get("/:id",protegerRuta, obtenerProgresoUsuario);
router.get("/usuario/estadisticas", protegerRuta, obtenerEstadisticasProgreso);


export default router;
