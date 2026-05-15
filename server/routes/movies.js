// MéthodeRouteAuth requiseActionPOST/api/auth/register✗Créer un comptePOST/api/auth/login✗Se connecter, reçoit un JWTGET/api/movies✓ JWTLister ses filmsPOST/api/movies✓ JWTAjouter un filmDELETE/api/movies/:id✓ JWTSupprimer un film

const express = require('express');
const db = require('../db');
const router = express.Router();


// Routes for movies
router.get('/movies', (req, res) => {
    // Récupérer tous les films depuis la base de données (sans identification)
    db.execute('SELECT * FROM movies')
        .then(([rows]) => {
            return res.json({ movies: rows });
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des films :', error);
            return res.status(500).json({ message: 'Erreur serveur' });
        });
    
    
});

router.post('/movies', (req, res) => {
    const { userId, title, genre, note, statut } = req.body;
    console.log({ userId, title, genre, note, statut });

    /* Utiliser l'identifiant de l'utilisateur fourni */
    const userId = userId;

    /* incrementer l'identifiant du film dans la base de données */
    return db.execute('SELECT MAX(id) as maxId FROM movies')
        .then(([movieRows]) => {
            const movieId = movieRows[0].maxId ? movieRows[0].maxId + 1 : 1;
            return db.execute(
                'INSERT INTO movies (id, user_id, title, genre, note, statut) VALUES (?, ?, ?, ?, ?, ?)',
                [movieId, userId, title, genre, note, statut]
            );
        })
        .then(() => {
            return res.status(201).json({ message: 'Film ajouté avec succès' });
        })
        .catch((error) => {
            console.error("Erreur lors de l'ajout du film :", error);
            return res.status(500).json({ message: 'Erreur serveur' });
        });
});

router.delete('/movies/:id', (req, res) => {
    const { id } = req.params;
    console.log({ id });
    // Supprimer le film par id (sans contrainte d'utilisateur)
    db.execute('DELETE FROM movies WHERE id = ?', [id])
        .then(([result]) => {
            if (result.affectedRows && result.affectedRows > 0) {
                return res.json({ message: `Film avec ID ${id} supprimé` });
            }
            return res.status(404).json({ message: 'Film non trouvé' });
        })
        .catch((error) => {
            console.error('Erreur lors de la suppression du film :', error);
            return res.status(500).json({ message: 'Erreur serveur' });
        });
});

module.exports = router;