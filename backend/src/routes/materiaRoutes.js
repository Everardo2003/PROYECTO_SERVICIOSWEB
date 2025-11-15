import express from 'express';
import { crearMateria, eliminarMateria, obtenerMaterias,actualizarMateria, obtenerMateriaPorId, obtenerSubtemasPorId} from '../controllers/materiaController.js';
import { protegerRuta } from '../middlewares/authMiddleware.js';
import { verificarAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

//Acceso general
router.get('/',protegerRuta, obtenerMaterias);
router.get('/:id', protegerRuta, obtenerMateriaPorId);
router.get('/subtemas/:id',protegerRuta,obtenerSubtemasPorId);
//Acceso solo del admin

router.post('/agregar-materia',protegerRuta, verificarAdmin,crearMateria);
router.delete('/:id',protegerRuta,verificarAdmin,eliminarMateria);
router.put("/:id", protegerRuta, verificarAdmin, actualizarMateria);


export default router;
