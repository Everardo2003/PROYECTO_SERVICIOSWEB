import mongoose from "mongoose";

const progresoSchema = new mongoose.Schema({
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
    type: String, // nombre del tema
    required: true,
  },
  pregunta: {
    type: String, // texto de la pregunta
    required: true,
  },
  respuestaUsuario: {
    type: String,
  },
  esCorrecta: {
    type: Boolean,
    default: false,
  },
  retroalimentacion: {
    type: String,
  },
  fechaInicio: {
    type: Date,
    default: Date.now,
  },
  fechaUltimoAvance: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Progreso", progresoSchema);
