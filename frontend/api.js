// /frontend/api.js

const BASE_URL = '/tasks';

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

export async function getTasks(query = '') {
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

export async function updateTaskContent(id, taskData) {
    return fetchAPI(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    });
}

export async function toggleTaskStatus(id) {
    return fetchAPI(`${BASE_URL}/${id}/toggle`, {
        method: 'PUT',
    });
}

// NUEVA FUNCIÓN
export async function toggleTaskArchive(id) {
    return fetchAPI(`${BASE_URL}/${id}/toggle-archive`, {
        method: 'PUT',
    });
}

export async function deleteTask(id) {
    return fetchAPI(`${BASE_URL}/${id}`, {
        method: 'DELETE',
    });
}