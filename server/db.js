
const mysql = require('mysql2/promise');
require('dotenv').config();

// creer un pool de connection a la base de données
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

module.exports = pool; 

/* exemple de connexion unique sans pool*/
// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// }); Mais une connection unique est fragile et 
// peut causer des problèmes de performance et de 
// fiabilité, surtout dans une application à fort 
// trafic. Le pool de connexions permet de 
// réutiliser les connexions existantes, ce qui 
// améliore les performances et la gestion des ressources.
