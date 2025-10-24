import express from 'express';
import { registrarUsuario, obtenerUsuarios,loginUsuario,actualizarUsuario,eliminarUsuario, } from '../controllers/usuarioController.js';
import { protegerRuta } from '../middlewares/authMiddleware.js';
import { verificarAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

//Acceso general
router.post('/',protegerRuta, registrarUsuario);
router.post('/login', loginUsuario); 

//Acceso admin
router.get('/', protegerRuta,verificarAdmin,obtenerUsuarios);
router.put("/:id",protegerRuta, verificarAdmin,actualizarUsuario);
router.delete("/:id",protegerRuta,verificarAdmin,eliminarUsuario);

export default router;
