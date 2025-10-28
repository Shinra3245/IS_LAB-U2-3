// /backend/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Definimos la ruta de la base de datos dentro de la carpeta 'backend'
const DB_PATH = path.join(__dirname, 'tasks.db');

// verbose() nos da más información en caso de errores
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
        throw err;
    }
    console.log('Conectado a la base de datos SQLite.');
});

// serialize() asegura que los comandos se ejecuten en orden
db.serialize(() => {
    // Creamos la tabla 'tasks' si no existe
    const sql = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `;
    db.run(sql, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message);
        } else {
            console.log('Tabla "tasks" asegurada.');
        }
    });
});

module.exports = db;