import Progreso from "../models/Progreso.js";
import { generarRetroalimentacion } from "../services/gptService.js";

export const responderEjercicio = async (req, res) => {
  try {
    const { materiaId, tema, pregunta, respuestaUsuario, respuestaCorrecta } = req.body;

    // 1️⃣ Verificar si la respuesta es correcta
    const esCorrecta =
      respuestaUsuario.trim().toLowerCase() === respuestaCorrecta.trim().toLowerCase();

    // 2️⃣ Generar retroalimentación con Groq
    const retroalimentacion = await generarRetroalimentacion({
      pregunta,
      respuestaUsuario,
      respuestaCorrecta,
      esCorrecta,
    });

    // 3️⃣ Buscar si ya existe un progreso del mismo usuario, materia, tema y pregunta
    let progreso = await Progreso.findOne({
      usuario: req.usuario._id,
      materia: materiaId,
      tema,
      pregunta,
    });

    if (progreso) {
      // 🔁 Ya existe → actualizar
      progreso.respuestaUsuario = respuestaUsuario;
      progreso.esCorrecta = esCorrecta;
      progreso.retroalimentacion = retroalimentacion;
      progreso.fechaUltimoAvance = new Date();

      await progreso.save();

      return res.status(200).json({
        msg: "Progreso actualizado correctamente",
        progreso,
      });
    } else {
      // 🆕 No existe → crear nuevo
      progreso = new Progreso({
        usuario: req.usuario._id,
        materia: materiaId,
        tema,
        pregunta,
        respuestaUsuario,
        esCorrecta,
        retroalimentacion,
      });

      await progreso.save();

      return res.status(201).json({
        msg: "Progreso guardado correctamente",
        progreso,
      });
    }
  } catch (error) {
    console.error("Error procesando respuesta:", error);
    res.status(500).json({ msg: "Error al procesar respuesta", error });
  }
};
