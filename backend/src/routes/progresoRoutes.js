import express from "express";
import { responderEjercicio } from "../controllers/progresoController.js";
import { protegerRuta } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/responder", protegerRuta, responderEjercicio);

export default router;
