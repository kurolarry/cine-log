const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const db = require('../db'); 
require('dotenv').config();

// Route d'inscription POST /api/auth/register
router.post('/register', async (req, res) => { 
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    /* incrementer l'identifiant de l'utilisateur dans la base de données */
    const [userRows] = await db.execute('SELECT MAX(id) as maxId FROM users');
    const userId = userRows[0].maxId ? userRows[0].maxId + 1 : 1; 

    /* Vérification de l'existence de l'utilisateur */
    try {
        /*hashage du mot de passe */
        const password_hash = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            'INSERT INTO users (id, pseudo, email, password_hash) VALUES (?, ?, ?, ?)',
            [userId, username, email, password_hash]
        );

        res.status(201).json({ message: 'Compte créé !', userId: result.insertId });

    } catch (error) { 
        /* Gestion des erreurs de doublon d'utilisateur */
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou email déjà utilisé' });
        }

        console.error('Erreur lors de l\'inscription :', error);
        res.status(500).json({ message: 'Erreur serveur' });

    }
});

// Route de connexion POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        /* Récupération de l'utilisateur par email */
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        const user = rows[0];

        /* Vérification du mot de passe hashé */
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        /* Génération du token JWT expirant dans 24h */
        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ message: 'Connexion réussie', token });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }

});

module.exports = router; /* Ce code gère les routes d'authentification pour l'inscription et la connexion des utilisateurs. */ 
