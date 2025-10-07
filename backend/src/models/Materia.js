import mongoose from 'mongoose';

const ejercicioSchema = new mongoose.Schema({
  pregunta: String,
  opciones: [String],
  respuestaCorrecta: String,
});

const temaSchema = new mongoose.Schema({
  nombre: String,
  subtemas: [String],
  contenido: String,
  ejercicios: [ejercicioSchema],
});

const materiaSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  temas: [temaSchema],
});

export default mongoose.model('Materia', materiaSchema);
