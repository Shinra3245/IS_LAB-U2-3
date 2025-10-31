// /frontend/api.js

const BASE_URL = 'http://localhost:3000/tasks';

/**
 * Encapsula la lógica de fetch y manejo de errores.
 * @param {string} endpoint - El endpoint de la API (ej. /tasks)
 * @param {object} options - Opciones para fetch (method, headers, body)
 * @returns {Promise<any>} - La respuesta JSON
 */
async function fetchAPI(endpoint, options = {}) {
    const response = await fetch(endpoint, options);
    
    if (response.status === 204) {
        return { ok: true };
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `Error HTTP: ${response.status}`);
    }
    
    return data;
}

// --- Funciones del CRUD ---

/**
 * MODIFICADO: Lee las tareas, opcionalmente filtradas por un query.
 * @param {string} query - El término de búsqueda (opcional)
 */
export async function getTasks(query = '') {
    // Si hay 'query', la añade a la URL como un query parameter
    const url = query 
        ? `${BASE_URL}?search=${encodeURIComponent(query)}` 
        : BASE_URL;
        
    return fetchAPI(url);
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
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    });
}

/**
 * Marca una tarea como completada o pendiente
 */
export async function toggleTaskStatus(id) {
    return fetchAPI(`${BASE_URL}/${id}/toggle`, {
        method: 'PUT',
    });
}

/**
 * Elimina una tarea
 */
export async function deleteTask(id) {
    await fetchAPI(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
    return { ok: true }; // Devuelve un objeto simple para confirmar
}