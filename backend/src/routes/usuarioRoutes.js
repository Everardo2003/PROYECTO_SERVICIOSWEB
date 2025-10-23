import express from 'express';
import { registrarUsuario, obtenerUsuarios,loginUsuario,actualizarUsuario,eliminarUsuario, } from '../controllers/usuarioController.js';
import { protegerRuta } from '../middlewares/authMiddleware.js';

const router = express.Router();

//Endpoints
router.post('/',protegerRuta, registrarUsuario);
router.get('/', protegerRuta,obtenerUsuarios);
router.post('/login', loginUsuario); 
router.put("/:id",protegerRuta, actualizarUsuario);
router.delete("/:id",protegerRuta,eliminarUsuario);

export default router;
