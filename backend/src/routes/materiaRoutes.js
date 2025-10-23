import express from 'express';
import { crearMateria, obtenerMaterias } from '../controllers/materiaController.js';
import { protegerRuta } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/',protegerRuta, crearMateria);
router.get('/',protegerRuta, obtenerMaterias);

export default router;
