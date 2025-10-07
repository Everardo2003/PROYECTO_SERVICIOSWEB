import Usuario from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import { generarJWT } from '../utils/generarjwt.js';

// Registrar usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) return res.status(400).json({ msg: 'El correo ya está registrado' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({ nombre, correo, password: hashedPassword });
    await nuevoUsuario.save();

    res.status(201).json({ msg: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al registrar usuario', error });
  }
};

// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password'); // Excluye la contraseña
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener usuarios', error });
  }
};

//LOGIN
export const loginUsuario = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(400).json({ msg: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

    // Generar token
    const token = generarJWT(usuario._id);
    res.json({
      msg: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
      }
    });
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    res.status(500).json({ msg: 'Error en el login', error: error.message });
  }
};

