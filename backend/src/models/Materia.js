import mongoose from "mongoose";

const ejercicioSchema = new mongoose.Schema({
  pregunta: String,
  opciones: [String],
  respuestaCorrecta: String,
});

const subtemaSchema = new mongoose.Schema({
  nombre: String,
  contenido: String,
  ejercicios: [ejercicioSchema], // ✅ Ahora cada subtema tiene sus propios ejercicios
});

const temaSchema = new mongoose.Schema({
  nombre: String,
  contenido: String, // contenido general del tema
  subtemas: [subtemaSchema], // ✅ Cada subtema incluye ejercicios
});

const materiaSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  temas: [temaSchema],
});

export default mongoose.model("Materia", materiaSchema);