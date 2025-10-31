// /frontend/api.js

// Usamos la URL base de la API. (Solución B de nuestro chat anterior)
const BASE_URL = 'http://localhost:3000/tasks';

/**
 * Encapsula la lógica de fetch y manejo de errores.
 * @param {string} endpoint - El endpoint de la API (ej. /tasks)
 * @param {object} options - Opciones para fetch (method, headers, body)
 * @returns {Promise<any>} - La respuesta JSON
 */
async function fetchAPI(endpoint, options = {}) {
    const response = await fetch(endpoint, options);
    
    // Si el método es DELETE y la respuesta es 204, no hay JSON, retornamos ok.
    if (response.status === 204) {
        return { ok: true };
    }

    const data = await response.json();

    if (!response.ok) {
        // Si hay un error, el JSON suele tener un { error: '...' }
        throw new Error(data.error || `Error HTTP: ${response.status}`);
    }
    
    return data;
}

// --- Funciones del CRUD ---

export async function getTasks() {
    return fetchAPI(BASE_URL);
}

export async function createTask(taskData) {
    return fetchAPI(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    });
}

/**
 * Actualiza el título y/o descripción de una tarea
 */
export async function updateTaskContent(id, taskData) {
    return fetchAPI(`${BASE_URL}/${id}`, {
        method: 'PATCH', // Usamos PATCH para actualizaciones parciales
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    });
}

/**
 * Marca una tarea como completada o pendiente (toggle)
 */
export async function toggleTaskStatus(id) {
    return fetchAPI(`${BASE_URL}/${id}`, {
        method: 'PUT',
    });
}

export async function deleteTask(id) {
    return fetchAPI(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
}