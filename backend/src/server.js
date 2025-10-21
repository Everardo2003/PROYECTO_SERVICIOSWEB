import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import materiaRoutes from './routes/materiaRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

// Conectar con MongoDB 
connectDB();

// Rutas base
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/materias', materiaRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('API funcionando con MongoDB');
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
