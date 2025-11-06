import mongoose from 'mongoose';

const ejercicioSchema = new mongoose.Schema({
  pregunta: String,
  opciones: [String],
  respuestaCorrecta: String,
});

//  Nuevo: cada subtema tiene su propio nombre y contenido
const subtemaSchema = new mongoose.Schema({
  nombre: String,
  contenido: String,
});

const temaSchema = new mongoose.Schema({
  nombre: String,
  subtemas: [subtemaSchema], // Ahora es un array de objetos, no solo strings
  contenido: String, // contenido general del tema
  ejercicios: [ejercicioSchema],
});

const materiaSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  temas: [temaSchema],
});

export default mongoose.model('Materia', materiaSchema);
