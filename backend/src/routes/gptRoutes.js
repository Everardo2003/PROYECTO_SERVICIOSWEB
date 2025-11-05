import express from "express";
import {generarRetroalimentacion } from '../services/gptService.js';

const router = express.Router();

router.post('/retroalimentar', async (req, res) => {
  try {
    const { pregunta, respuestaUsuario, respuestaCorrecta, tema } = req.body;

    if (!pregunta || !respuestaUsuario || !respuestaCorrecta) {
      return res.status(400).json({ msg: 'Faltan datos en la solicitud' });
    }

    const retroalimentacion = await generarRetroalimentacion(
      pregunta,
      respuestaUsuario,
      respuestaCorrecta,
      tema
    );
    console.log("Retroalimentación generada:", retroalimentacion);
    res.json({ retroalimentacion });
  } catch (error) {
    console.error('Error generando retroalimentación:', error);
    res.status(500).json({ msg: 'Error generando retroalimentación', error });
  }
});



export default router;
