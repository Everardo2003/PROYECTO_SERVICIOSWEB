
export const verificarAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ msg: "No autenticado" });
  }

  if (req.usuario.rol !== "admin") {
    return res.status(403).json({ msg: "Acceso denegado. Solo administradores pueden realizar esta acción." });
  }

  next();
};
