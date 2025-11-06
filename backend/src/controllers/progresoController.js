import Progreso from "../models/Progreso.js";
import { generarRetroalimentacion } from "../services/gptService.js";
import PreguntasGeneradas from "../models/preguntaGenerada.js";
import Materia from "../models/Materia.js";

export const responderEjercicio = async (req, res) => {
  try {
    const { preguntasGeneradasId, pregunta, respuestaUsuario } = req.body;
    const usuarioId = req.usuario._id;

    // Buscar el documento de preguntas generadas
    const registroPreguntas = await PreguntasGeneradas.findById(preguntasGeneradasId);
    if (!registroPreguntas) {
      return res.status(404).json({ msg: "Documento de preguntas no encontrado" });
    }

    // Buscar la pregunta dentro del documento
    const preguntaObj = registroPreguntas.preguntas.find(p => p.pregunta === pregunta);
    if (!preguntaObj) {
      return res.status(404).json({ msg: "Pregunta no encontrada en el documento" });
    }

    const respuestaCorrecta = preguntaObj.respuestaCorrecta;

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

    // Buscar si ya existe un progreso para esta pregunta del usuario
    let progreso = await Progreso.findOne({
      usuario: usuarioId,
      preguntasGeneradas: preguntasGeneradasId,
      pregunta,
    });

    if (progreso) {
      // Actualizar respuesta existente
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
      // Crear nuevo progreso
      progreso = new Progreso({
        usuario: usuarioId,
        preguntasGeneradas: preguntasGeneradasId,
        materia: registroPreguntas.materia,
        tema: registroPreguntas.tema,
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

    const documentos = await PreguntasGeneradas.find({ usuario: usuarioId })
      .populate("materia", "nombre");

    if (!documentos.length)
      return res.status(404).json({ msg: "No hay preguntas generadas aún" });

    const estadisticas = {};

    for (const doc of documentos) {
      const docId = doc._id.toString();
      const materia = doc.materia.nombre;
      const tema = doc.tema;

      if (!estadisticas[materia]) estadisticas[materia] = {};
      if (!estadisticas[materia][tema]) estadisticas[materia][tema] = {};

      const totalPreguntas = doc.preguntas.length;

      // Buscar progresos relacionados a este documento
      const progresos = await Progreso.find({
        usuario: usuarioId,
        preguntasGeneradas: doc._id, // <-- campo que debes agregar en Progreso
      });

      const respondidas = progresos.filter(p => p.respuestaUsuario).length;
      const correctas = progresos.filter(p => p.esCorrecta).length;

      estadisticas[materia][tema][docId] = {
        totalPreguntas,
        respondidas,
        correctas,
        progreso: Math.round((correctas / totalPreguntas) * 100),
        porcentajeAciertos: respondidas
          ? Math.round((correctas / respondidas) * 100)
          : 0,
      };
    }

    res.status(200).json({
      msg: "Estadísticas por documento obtenidas correctamente",
      estadisticas,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener estadísticas", error });
  }
};
export const responderEjercicioMateria = async (req, res) => {
  try {
    const { materiaId, temaNombre, pregunta, respuestaUsuario } = req.body;
    const usuarioId = req.usuario._id;

    // 1️⃣ Buscar la materia
    const materia = await Materia.findById(materiaId);
    if (!materia) {
      return res.status(404).json({ msg: "Materia no encontrada" });
    }

    // 2️⃣ Buscar el tema dentro de la materia
    const tema = materia.temas.find(t => t.nombre === temaNombre);
    if (!tema) {
      return res.status(404).json({ msg: "Tema no encontrado en la materia" });
    }

    // 3️⃣ Buscar el ejercicio por su pregunta
    const ejercicio = tema.ejercicios.find(e => e.pregunta === pregunta);
    if (!ejercicio) {
      return res.status(404).json({ msg: "Ejercicio no encontrado en el tema" });
    }

    const respuestaCorrecta = ejercicio.respuestaCorrecta;

    // 4️⃣ Verificar si la respuesta es correcta
    const esCorrecta =
      respuestaUsuario.trim().toLowerCase() === respuestaCorrecta.trim().toLowerCase();

    // 5️⃣ Generar retroalimentación con Groq
    const retroalimentacion = await generarRetroalimentacion({
      pregunta,
      respuestaUsuario,
      respuestaCorrecta,
      esCorrecta,
    });

    // 6️⃣ Buscar si ya existe un progreso guardado para este ejercicio
    let progreso = await Progreso.findOne({
      usuario: usuarioId,
      materia: materiaId,
      tema: temaNombre,
      pregunta,
    });

    if (progreso) {
      // Actualizar el progreso existente
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
      // Crear nuevo progreso
      progreso = new Progreso({
        usuario: usuarioId,
        materia: materiaId,
        tema: temaNombre,
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
    console.error("Error procesando respuesta de ejercicio:", error);
    res.status(500).json({ msg: "Error al procesar respuesta del ejercicio", error });
  }
};
