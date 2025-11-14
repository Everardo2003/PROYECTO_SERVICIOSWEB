import express from 'express';
import { registrarUsuario, obtenerUsuarios,loginUsuario,actualizarUsuario,eliminarUsuario,obtenerUsuarioPorId } from '../controllers/usuarioController.js';
import { protegerRuta } from '../middlewares/authMiddleware.js';
import { verificarAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

//Acceso general
router.post('/',registrarUsuario);
router.post('/login', loginUsuario);
router.put("/:id",protegerRuta,actualizarUsuario);

//Acceso admin
router.get('/', protegerRuta,verificarAdmin,obtenerUsuarios);
router.get("/:id",protegerRuta,verificarAdmin,obtenerUsuarioPorId); 
router.delete("/:id",protegerRuta,verificarAdmin,eliminarUsuario);

export default router;
