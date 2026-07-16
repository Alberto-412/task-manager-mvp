const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

const frontendUrl = process.env.FRONTEND_URL;
app.use(cors(frontendUrl ? { origin: frontendUrl } : {}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

module.exports = app;
