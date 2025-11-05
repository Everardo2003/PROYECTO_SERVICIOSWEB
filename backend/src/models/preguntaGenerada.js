import mongoose from "mongoose";

const preguntaSchema = new mongoose.Schema({
  pregunta: String,
  opciones: [String],
  respuestaCorrecta: String,
});

const preguntasGeneradasSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  materia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Materia",
    required: true,
  },
  tema: {
    type: String,
    required: true,
  },
  preguntas: [preguntaSchema], // 🔹 todas las preguntas en un array
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  ultimaActualizacion: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("PreguntasGeneradas", preguntasGeneradasSchema);
