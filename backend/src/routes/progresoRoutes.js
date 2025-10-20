import express from "express";
import {
  responderEjercicio,
  obtenerProgresoUsuario,
  obtenerEstadisticasProgreso
} from "../controllers/progresoController.js";
import { protegerRuta } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/responder", protegerRuta, responderEjercicio);
router.get("/",protegerRuta, obtenerProgresoUsuario);
router.get("/estadisticas", protegerRuta, obtenerEstadisticasProgreso);

export default router;
