import { generarPreguntas } from "../services/gptService.js";

export const generarPreguntasHandler = async (req, res) => {
  try {
    const { materiaId, index, cantidad } = req.body;
    const usuarioId = req.usuario._id;
    if (!materiaId || index === undefined || !cantidad) {
      return res.status(400).json({ msg: "Faltan parámetros" });
    }

    const registro = await generarPreguntas(usuarioId, materiaId, index, cantidad);

    res.status(200).json({
      msg: "Preguntas generadas correctamente",
      registro,
    });
  } catch (error) {
    console.error("Error generando preguntas:", error);
    res.status(500).json({ msg: "Error generando preguntas", error });
  }
};
