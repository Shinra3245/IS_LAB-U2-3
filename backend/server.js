// /backend/server.js
const express = require('express');
const cors = require('cors');

const { addTask } = require('./tasks'); 

const app = express();
const port = 3000;

let globalTasks = []; 

app.use(cors()); 

app.use(express.json()); 


app.post('/tasks', (req, res) => {
    // 1. Recibir los datos del frontend (body)
    const { title, description } = req.body;
    
    // 2. Validaciones simples del backend (opcional pero buena práctica)
    if (!title) {
        // Manejo de errores [cite: 8]
        return res.status(400).json({ error: 'El título de la tarea es obligatorio.' });
    }

    try {
        // 3. Usar la lógica probada con TDD para agregar la tarea
        const newTask = addTask(globalTasks, title, description); 
        
        // 4. Devolver la tarea creada con éxito (código 201 Created)
        res.status(201).json(newTask); 

    } catch (error) {
        // 5. Manejo de errores en persistencia [cite: 9]
        console.error('Error al guardar la tarea:', error);
        res.status(500).json({ error: 'Error interno del servidor al guardar la tarea.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor de la API corriendo en http://localhost:${port}`);
});