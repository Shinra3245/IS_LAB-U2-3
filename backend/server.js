// /backend/server.js
const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(express.static(path.join(__dirname, '..', 'frontend')));
const port = 3000;

app.use(cors());
app.use(express.json());

// --- CRUD Endpoints ---

// CREATE (Crear)
app.post('/tasks', (req, res) => {
    const { title, description, priority } = req.body; // MODIFICADO

    if (!title) {
        return res.status(400).json({ error: 'El título de la tarea es obligatorio.' });
    }

    const sql = `INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)`; // MODIFICADO
    db.run(sql, [title, description || null, priority || 2], function (err) { // MODIFICADO
        if (err) {
            console.error('Error al insertar en la BD:', err.message);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        
        db.get(`SELECT * FROM tasks WHERE id = ?`, [this.lastID], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Error al recuperar la tarea creada.' });
            }
            res.status(201).json(row);
        });
    });
});

// READ
app.get('/tasks', (req, res) => {
    const { search } = req.query;
    let sql = '';
    const params = [];

    if (search) {
        sql = `SELECT * FROM tasks WHERE title LIKE ?`;
        params.push(`%${search}%`);
    } else {
        sql = `SELECT * FROM tasks`;
    }

    
    sql += ` ORDER BY archived ASC, priority ASC, createdAt DESC`;

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error al consultar la BD:', err.message);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        res.status(200).json(rows);
    });
});

// UPDATE (Actualizar Título/Descripción/Prioridad)
app.patch('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, priority } = req.body; 

    if (!title) {
        return res.status(400).json({ error: 'El título no puede estar vacío.' });
    }

    const sql = `
        UPDATE tasks 
        SET title = ?, description = ?, priority = ?
        WHERE id = ?
    `;

    db.run(sql, [title, description || null, priority, id], function (err) { // MODIFICADO
        if (err) {
            console.error('Error al actualizar (PATCH) en la BD:', err.message);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada.' });
        }

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
        db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Error al recuperar la tarea actualizada.' });
            }
            res.status(200).json(row);
        });
    });
});

//UPDATE (Marcar como archivada/desarchivada)
app.put('/tasks/:id/toggle-archive', (req, res) => {
    const { id } = req.params;
    const sql = `
        UPDATE tasks 
        SET archived = NOT archived 
        WHERE id = ?
    `;

    db.run(sql, [id], function (err) {
        if (err) {
            console.error('Error al archivar en la BD:', err.message);
            return res.status(500).json({ error: 'Error interno del servidor.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada.' });
        }
        
        db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Error al recuperar la tarea (archivada).' });
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
        res.status(204).send();
    });
});

app.listen(port, () => {
    console.log(`Servidor de la API corriendo en http://localhost:${port}`);
});