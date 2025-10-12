import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generarPreguntas = async (materia, tema, cantidad=5) => {
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

    // Intentar parsear JSON, si falla, devolver error amigable
    try {
      return JSON.parse(texto);
    } catch {
      console.error("Respuesta de Groq no es JSON válido:", texto);
      return [];
    }

  } catch (error) {
    console.error("Error generando preguntas con Groq:", error);
    throw error;
  }
};
