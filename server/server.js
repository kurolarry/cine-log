// server/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

const app = express();

// Middleware
app.use(cors()); // pour permettre les requêtes depuis le navigateur
app.use(express.json()); // pour parser le JSON des requêtes entrantes
app.use(express.static('../public')); // pour servir les fichiers HTML, CSS, JS

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Ciné-Log lancé sur http://localhost:${PORT}`);
});