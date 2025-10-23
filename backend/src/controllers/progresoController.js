import Progreso from "../models/Progreso.js";
import { generarRetroalimentacion } from "../services/gptService.js";

export const responderEjercicio = async (req, res) => {
  try {
    const { materiaId, tema, pregunta, respuestaUsuario, respuestaCorrecta } = req.body;

    // Verificar si la respuesta es correcta
    const esCorrecta =
      respuestaUsuario.trim().toLowerCase() === respuestaCorrecta.trim().toLowerCase();

    // Generar retroalimentación con Groq
    const retroalimentacion = await generarRetroalimentacion({
      pregunta,
      respuestaUsuario,
      respuestaCorrecta,
      esCorrecta,
    });

    // Buscar si ya existe un progreso del mismo usuario, materia, tema y pregunta
    let progreso = await Progreso.findOne({
      usuario: req.usuario._id,
      materia: materiaId,
      tema,
      pregunta,
    });

    if (progreso) {
      // Ya existe → actualizar
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
      //No existe → crear nuevo
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

export const obtenerProgresoUsuario = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    // Buscar todos los progresos del usuario, ordenados por materia y tema
    const progresos = await Progreso.find({ usuario: usuarioId })
      .populate("materia", "nombre") // trae el nombre de la materia
      .sort({ fechaUltimoAvance: -1 });

    if (!progresos.length) {
      return res.status(404).json({ msg: "No hay progreso registrado aún" });
    }

    // Agrupar por materia y tema
    const agrupado = {};

    progresos.forEach((p) => {
      const materia = p.materia.nombre;
      const tema = p.tema;

      if (!agrupado[materia]) agrupado[materia] = {};
      if (!agrupado[materia][tema]) agrupado[materia][tema] = [];

      agrupado[materia][tema].push({
        pregunta: p.pregunta,
        respuestaUsuario: p.respuestaUsuario,
        esCorrecta: p.esCorrecta,
        retroalimentacion: p.retroalimentacion,
        fechaUltimoAvance: p.fechaUltimoAvance,
      });
    });

    res.status(200).json({
      msg: "Progreso obtenido correctamente",
      progreso: agrupado,
    });
  } catch (error) {
    console.error("Error al obtener progreso:", error);
    res.status(500).json({ msg: "Error al obtener progreso", error });
  }
};

export const obtenerEstadisticasProgreso = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    const progresos = await Progreso.find({ usuario: usuarioId }).populate("materia", "nombre");

    if (!progresos.length) {
      return res.status(404).json({ msg: "No hay progreso registrado aún" });
    }

    const estadisticas = {};

    progresos.forEach((p) => {
      const materia = p.materia.nombre;
      const tema = p.tema;

      if (!estadisticas[materia]) estadisticas[materia] = {};
      if (!estadisticas[materia][tema])
        estadisticas[materia][tema] = { respondidas: 0, correctas: 0, porcentaje: 0 };

      estadisticas[materia][tema].respondidas += 1;
      if (p.esCorrecta) estadisticas[materia][tema].correctas += 1;
    });

    // Calcular porcentaje
    for (const materia in estadisticas) {
      for (const tema in estadisticas[materia]) {
        const { respondidas, correctas } = estadisticas[materia][tema];
        estadisticas[materia][tema].porcentaje = Math.round((correctas / respondidas) * 100);
      }
    }

    res.status(200).json({
      msg: "Estadísticas de progreso obtenidas correctamente",
      estadisticas,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ msg: "Error al obtener estadísticas de progreso", error });
  }
};