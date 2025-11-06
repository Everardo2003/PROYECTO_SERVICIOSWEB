import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import Materia from '../models/Materia.js';
import preguntaGenerada from '../models/preguntaGenerada.js';
dotenv.config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


export const generarPreguntas = async (usuarioId, materiaId, temaIndex, cantidad) => {
  const materia = await Materia.findById(materiaId);
  if (!materia) throw new Error("Materia no encontrada");

  const tema = materia.temas[temaIndex];
  if (!tema) throw new Error("Tema no encontrado en la materia");

  const contenido = tema.subtemas.join("\n") + "\n" + tema.contenido;

  const prompt = `
Genera ${cantidad} preguntas de opción múltiple basadas en la siguiente información:
"${contenido}"

Devuelve solo JSON válido, sin texto adicional. Ejemplo:

[
  {
    "pregunta": "¿Qué es ...?",
    "opciones": ["op1", "op2", "op3"],
    "respuestaCorrecta": "op1"
  }
]
  `;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "Eres un asistente educativo que genera preguntas claras." },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
    });

    const texto = response.choices[0].message.content.trim();

    let preguntas = [];
    try {
      preguntas = JSON.parse(texto);
    } catch {
      console.error("Respuesta de Groq no es JSON válido:", texto);
      return [];
    }

    //Crear un nuevo documento cada vez
    const registro = new preguntaGenerada({
      usuario: usuarioId,
      materia: materiaId,
      tema: tema.nombre,
      preguntas,
      fechaCreacion: new Date(),
      ultimaActualizacion: new Date(),
    });

    await registro.save();

    return registro;
  } catch (error) {
    console.error("Error generando preguntas con Groq:", error);
    throw error;
  }
};



export const generarRetroalimentacion = async ({
  pregunta,
  respuestaUsuario,
  respuestaCorrecta,
  esCorrecta,
}) => {
  try {
    // Detectamos si es un ejercicio de programación o una pregunta con opciones
    const esEjercicioCodigo =
      pregunta.toLowerCase().includes("programa") ||
      pregunta.toLowerCase().includes("algoritmo") ||
      pregunta.toLowerCase().includes("función") ||
      respuestaUsuario?.includes("function") ||
      respuestaUsuario?.includes("if") ||
      respuestaUsuario?.includes("while") ||
      respuestaUsuario?.includes("for");

    let prompt;

    if (esEjercicioCodigo) {
      // 🧠 Caso: ejercicio de programación
      prompt = `
Eres un profesor de programación. Evalúa la siguiente respuesta de un estudiante:

Ejercicio: ${pregunta}
Código del estudiante:
${respuestaUsuario}

Compara con la solución esperada (si aplica):
${respuestaCorrecta || "No hay una respuesta exacta, solo evalúa la lógica."}

Indica si la respuesta es correcta: ${esCorrecta ? "Sí" : "No"}.
Da una retroalimentación **breve (máx 3 líneas)** enfocada en:
- Qué hizo bien.
- Qué podría mejorar.
      `;
    } else {
      // 📘 Caso: pregunta de opción múltiple o texto corto
      prompt = `
Eres un profesor de programación. Evalúa la siguiente respuesta de un estudiante:

Pregunta: ${pregunta}
Respuesta del estudiante: ${respuestaUsuario}
Respuesta correcta: ${respuestaCorrecta}
¿La respuesta es correcta?: ${esCorrecta ? "Sí" : "No"}

Da una retroalimentación breve y educativa (máx 2 líneas), enfocada en reforzar el aprendizaje.
      `;
    }

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generando retroalimentación con Groq:", error);
    return "No se pudo generar retroalimentación en este momento.";
  }
};
