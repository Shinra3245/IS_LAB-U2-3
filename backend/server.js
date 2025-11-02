// /backend/server.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./database'); // Importamos la base de datos
// Ya no importamos 'addTask', la lógica de SQL vivirá aquí

const app = express();
app.use(express.static(path.join(__dirname, '..', 'frontend')));
const port = 3000;

app.use(cors());
app.use(express.json());

// --- CRUD Endpoints ---

// CREATE (Crear)
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'El título de la tarea es obligatorio.' });
    }

    const sql = `INSERT INTO tasks (title, description) VALUES (?, ?)`;

    // 'function()' se usa para poder acceder a 'this.lastID'
    db.run(sql, [title, description || null], function (err) {
        if (err) {
            console.error('Error al insertar en la BD:', err.message);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }

        // Devolvemos la tarea recién creada consultándola por su ID
        db.get(`SELECT * FROM tasks WHERE id = ?`, [this.lastID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Error al recuperar la tarea creada.' });
            }
            res.status(201).json(row);
        });
    });
});

// READ (Leer todas)
// READ (Leer todas)
app.get('/tasks', (req, res) => {
    // 1. Obtenemos el query parameter 'search' [cite: 9]
    const { search } = req.query;

    let sql = '';
    const params = [];

    // 2. Comprobamos si 'search' tiene un valor
    if (search) {
        // 3a. Si hay búsqueda, modificamos la SQL para filtrar [cite: 11]
        sql = `SELECT * FROM tasks WHERE title LIKE ? ORDER BY createdAt DESC`;
        params.push(`%${search}%`); // 
    } else {
        // 3b. Si no hay búsqueda, usamos la consulta original 
        sql = `SELECT * FROM tasks ORDER BY createdAt DESC`;
        // params ya es [] por defecto
    }

    // 4. Ejecutamos la consulta (ya sea la original o la filtrada)
    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error al consultar la BD:', err.message);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        res.status(200).json(rows);
    });
});

// UPDATE (Actualizar Título/Descripción) - NUEVO
app.patch('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    // Validación simple
    if (!title) {
        return res.status(400).json({ error: 'El título no puede estar vacío.' });
    }

    const sql = `
        UPDATE tasks 
        SET title = ?, description = ? 
        WHERE id = ?
    `;

    db.run(sql, [title, description || null, id], function (err) {
        if (err) {
            console.error('Error al actualizar (PATCH) en la BD:', err.message);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada.' });
        }

        // Devolvemos la tarea actualizada
        db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Error al recuperar la tarea actualizada.' });
            }
            res.status(200).json(row);
        });
    });
});

// UPDATE (Marcar como completada/pendiente)
app.put('/tasks/:id/toggle', (req, res) => {
    const { id } = req.params;

    // Invertimos el estado 'completed'
    const sql = `
        UPDATE tasks 
        SET completed = NOT completed 
        WHERE id = ?
    `;

    db.run(sql, [id], function (err) {
        if (err) {
            console.error('Error al actualizar en la BD:', err.message);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada.' });
        }

        // Devolvemos la tarea actualizada
        db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Error al recuperar la tarea actualizada.' });
            }
            res.status(200).json(row);
        });
    });
});

// DELETE (Eliminar)
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM tasks WHERE id = ?`;

    db.run(sql, [id], function (err) {
        if (err) {
            console.error('Error al eliminar en la BD:', err.message);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada.' });
        }
        // Respondemos con éxito (204 No Content)
        res.status(204).send();
    });
});


app.listen(port, () => {
    console.log(`Servidor de la API corriendo en http://localhost:${port}`);
});