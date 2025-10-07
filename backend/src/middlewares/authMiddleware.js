import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const protegerRuta = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = await Usuario.findById(decoded.id).select('-password'); 
      next();
    } catch (error) {
      return res.status(401).json({ msg: 'Token no válido' });
    }
  }

  if (!token) return res.status(401).json({ msg: 'No hay token, acceso denegado' });
};
