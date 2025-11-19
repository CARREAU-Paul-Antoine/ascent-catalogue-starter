import express from 'express';
import { PORT_LISTEN } from '../config/network.js';
import formationRoutes from '../routes/formationRoutes.js';

const app = express();
const PORT = PORT_LISTEN || 4200;

app.use(express.json());

// Routes
app.use('/formations', formationRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
