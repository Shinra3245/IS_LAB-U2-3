// /backend/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'tasks.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
        throw err;
    }
    console.log('Conectado a la base de datos SQLite.');
});

db.serialize(() => {
    //Añadimos 'priority' y 'archived'
    const sql = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT 0,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
            
            -- 1: Alta, 2: Media, 3: Baja
            priority INTEGER DEFAULT 2, 
            
            -- 0: No archivado (activo), 1: Archivado
            archived BOOLEAN DEFAULT 0
        )
    `;
    db.run(sql, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message);
        } else {
            console.log('Tabla "tasks" asegurada (con prioridad y archivado).');
        }
    });
});

module.exports = db;