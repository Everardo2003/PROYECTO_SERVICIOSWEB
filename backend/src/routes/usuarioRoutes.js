import express from 'express';
import { registrarUsuario, obtenerUsuarios,loginUsuario,actualizarUsuario,eliminarUsuario, } from '../controllers/usuarioController.js';

const router = express.Router();

//Endpoints
router.post('/', registrarUsuario);
router.get('/', obtenerUsuarios);
router.post('/login', loginUsuario); 
router.put("/:id", actualizarUsuario);
router.delete("/:id",eliminarUsuario);

export default router;
