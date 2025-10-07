import express from 'express';
import { registrarUsuario, obtenerUsuarios,loginUsuario } from '../controllers/usuarioController.js';
import { protegerRuta } from '../middlewares/authMiddleware.js';

const router = express.Router();

//Endpoints
router.post('/', registrarUsuario);
router.get('/', obtenerUsuarios);
router.post('/login', loginUsuario); 

export default router;
