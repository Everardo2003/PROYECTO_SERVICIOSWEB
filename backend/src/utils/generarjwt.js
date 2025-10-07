import jwt from 'jsonwebtoken';

export const generarJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '2h' // El token expira en 2 horas
  });
};
