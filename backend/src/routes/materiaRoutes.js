import express from 'express';
import { crearMateria, eliminarMateria, obtenerMaterias,actualizarMateria } from '../controllers/materiaController.js';
import { protegerRuta } from '../middlewares/authMiddleware.js';
import { verificarAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

//Acceso general
router.get('/',protegerRuta, obtenerMaterias);

//Acceso solo del admin
router.post('/',protegerRuta, verificarAdmin,crearMateria);
router.delete('/:id',protegerRuta,verificarAdmin,eliminarMateria);
router.put("/:id", protegerRuta, verificarAdmin, actualizarMateria);


export default router;
