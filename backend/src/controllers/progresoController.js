import Progreso from "../models/Progreso.js";
import { generarRetroalimentacion } from "../services/gptService.js";
import PreguntasGeneradas from "../models/preguntaGenerada.js";
import Materia from "../models/Materia.js";

export const responderEjercicio = async (req, res) => {
  try {
    const { preguntasGeneradasId, pregunta, respuestaUsuario } = req.body;
    const usuarioId = req.usuario._id;
    console.log(respuestaUsuario);
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
    const { id } = req.params;

    const progresos = await Progreso.find({ usuario: id })
      .populate("usuario", "nombre correo")
      .populate("materia", "nombre")
      .populate("preguntasGeneradas")
      .sort({ fechaUltimoAvance: -1 });

    if (!progresos.length) {
      return res.status(200).json({
        usuario: null,
        progreso: [],
      });
    }

    const agrupado = {};

    progresos.forEach((p) => {
      const materia = p.materia?.nombre || "Sin materia";
      const tema = p.tema || "Sin tema";

      // 🔥 SI TIENE preguntasGeneradas → pertenece al TEMA, no subtema
      const subtema = p.preguntasGeneradas
        ? "Preguntas generadas por la IA"
        : p.subtema || "Sin subtema";

      if (!agrupado[materia]) agrupado[materia] = {};
      if (!agrupado[materia][tema]) agrupado[materia][tema] = {};
      if (!agrupado[materia][tema][subtema]) agrupado[materia][tema][subtema] = [];

      agrupado[materia][tema][subtema].push({
        docId: p.preguntasGeneradas?._id || null, // 🔥 AQUÍ VA EL ID REAL
        pregunta: p.pregunta,
        respuestaUsuario: p.respuestaUsuario,
        esCorrecta: p.esCorrecta,
        retroalimentacion: p.retroalimentacion,
        fechaUltimoAvance: p.fechaUltimoAvance,
      });
    });

    const usuario = {
      nombre: progresos[0].usuario?.nombre || "Desconocido",
      correo: progresos[0].usuario?.correo || "",
    };

    res.status(200).json({ usuario, progreso: agrupado });
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

    if (!documentos.length) {
      return res.status(404).json({ msg: "No hay preguntas generadas aún" });
    }

    const estadisticas = {};

    for (const doc of documentos) {
      const docId = doc._id.toString();
      const materia = doc.materia.nombre;
      const tema = doc.tema;

      if (!estadisticas[materia]) estadisticas[materia] = {};
      if (!estadisticas[materia][tema]) estadisticas[materia][tema] = {};

      const totalPreguntas = doc.preguntas.length;

      const progresos = await Progreso.find({
        usuario: usuarioId,
        preguntasGeneradas: doc._id,
      });

      const respondidas = progresos.filter(p => p.respuestaUsuario).length;
      const correctas = progresos.filter(p => p.esCorrecta).length;

      estadisticas[materia][tema][docId] = {
        totalPreguntas,
        respondidas,
        correctas,
        progreso: totalPreguntas
          ? Math.round((correctas / totalPreguntas) * 100)
          : 0,
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
    const { materiaId, temaNombre, subtemaNombre, pregunta, respuestaUsuario } = req.body;
    const usuarioId = req.usuario._id;


    // 1️⃣ Buscar la materia
    const materia = await Materia.findById(materiaId);
    if (!materia) {
      return res.status(404).json({ msg: "Materia no encontrada" });
    }

    // 2️⃣ Buscar el tema dentro de la materia
    const tema = materia.temas.find((t) => t.nombre === temaNombre);
    if (!tema) {
      return res.status(404).json({ msg: "Tema no encontrado en la materia" });
    }

    // 3️⃣ Buscar el subtema dentro del tema
    const subtema = tema.subtemas.find((s) => s.nombre === subtemaNombre);
    console.log(subtemaNombre);
    if (!subtema) {
      return res.status(404).json({ msg: "Subtema no encontrado en el tema" });
    }

    // 4️⃣ Buscar el ejercicio dentro del subtema
    const ejercicio = subtema.ejercicios?.find((e) => e.pregunta === pregunta);
    if (!ejercicio) {
      return res.status(404).json({ msg: "Ejercicio no encontrado en el subtema" });
    }

    const respuestaCorrecta = ejercicio.respuestaCorrecta;

    // 5️⃣ Verificar si la respuesta es correcta
    let esCorrecta =respuestaUsuario.trim().toLowerCase() === respuestaCorrecta.trim().toLowerCase();

    // 6️⃣ Generar retroalimentación con Groq (si tienes esa función)
    const retroalimentacion = await generarRetroalimentacion({
      pregunta,
      respuestaUsuario,
      respuestaCorrecta,
      esCorrecta,
    });
        if (typeof retroalimentacion === "string") {
          const texto = retroalimentacion.toLowerCase();

          if (
            texto.includes("correcta") ||
            texto.includes("correcto") ||
            texto.includes("bien hecho") ||
            texto.includes("acertada") ||
            texto.includes("respuesta es válida")
          ) {
            esCorrecta = true;
          } else {
            esCorrecta = false;
          }
        }

    // 7️⃣ Actualizar o crear el progreso
    const progreso = await Progreso.findOneAndUpdate(
      {
        usuario: usuarioId,
        materia: materiaId,
        tema: temaNombre,
        subtema: subtemaNombre,
        pregunta,
      },
      {
        respuestaUsuario,
        esCorrecta,
        retroalimentacion,
        YaResuelto: true,
        fechaUltimoAvance: new Date(),
        $setOnInsert: { fechaInicio: new Date() }, // solo si es nuevo

      },
      { new: true, upsert: true } // 🔹 crea si no existe
    );

    res.status(200).json({
      msg: "Progreso guardado o actualizado correctamente",
      progreso,
    });
  } catch (error) {
    console.error("Error procesando respuesta de ejercicio:", error);
    res.status(500).json({ msg: "Error al procesar respuesta del ejercicio", error });
  }
};
// /progreso/:documentoId
export const obtenerProgresoPorDocumento = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;
    const { id} = req.params;
    console.log(id);
    const progresos = await Progreso.find({
      usuario: usuarioId,
      preguntasGeneradas: id,
    });

    res.status(200).json(progresos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener progreso", error });
  }
};

