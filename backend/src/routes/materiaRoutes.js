import express from 'express';
import { crearMateria, obtenerMaterias } from '../controllers/materiaController.js';

const router = express.Router();

router.post('/', crearMateria);
router.get('/', obtenerMaterias);

export default router;
