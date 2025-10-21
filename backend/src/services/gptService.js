import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import Materia from '../models/Materia.js';
dotenv.config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


export const generarPreguntas = async (materiaId, temaIndex, cantidad) => {
  // 1️⃣ Obtener la materia de la DB
  const materia = await Materia.findById(materiaId);
  if (!materia) throw new Error("Materia no encontrada");

  // 2️⃣ Buscar el tema dentro de la materia
  // temaIndex viene del body
  const tema = materia.temas[temaIndex];
  if (!tema) throw new Error("Tema no encontrado en la materia");


  const contenido = tema.subtemas.join("\n") + "\n" + tema.contenido;

  const prompt = `
  Genera ${cantidad} preguntas de opción múltiple basadas en la siguiente información:
  "${contenido}"

  Devuelve solo JSON válido, sin texto adicional. Ejemplo:

  [
    {
      "pregunta": "...",
      "opciones": ["op1", "op2", "op3"],
      "respuestaCorrecta": "..."
    }
  ]
  `;

  try {
    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Eres un asistente educativo.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 500,
    });

    const texto = response.choices[0].message.content.trim();

    // 3️⃣ Parsear JSON
    let preguntas = [];
    try {
      preguntas = JSON.parse(texto);
    } catch {
      console.error("Respuesta de Groq no es JSON válido:", texto);
      return [];
    }

    // 4️⃣ Guardar preguntas en MongoDB, evitando duplicados
    preguntas.forEach(p => {
      const existe = tema.ejercicios.some(e => e.pregunta === p.pregunta);
      if (!existe) {
        tema.ejercicios.push({
          pregunta: p.pregunta,
          opciones: p.opciones,
          respuestaCorrecta: p.respuestaCorrecta
        });
      }
    });

    await materia.save(); // guardar cambios en MongoDB

    return preguntas;

  } catch (error) {
    console.error("Error generando preguntas con Groq:", error);
    throw error;
  }
};


export const generarRetroalimentacion = async ({ pregunta, respuestaUsuario, respuestaCorrecta, esCorrecta }) => {
  try {
    const prompt = `
Eres un profesor de programación. 
Evalúa la siguiente respuesta de un estudiante:
Pregunta: ${pregunta}
Respuesta del estudiante: ${respuestaUsuario}
Respuesta correcta: ${respuestaCorrecta}
¿La respuesta es correcta?: ${esCorrecta ? "Sí" : "No"}
Da una retroalimentación corta y educativa (máx 2 líneas).
`;

    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generando retroalimentación con Groq:", error);
    return "No se pudo generar retroalimentación en este momento.";
  }
};
