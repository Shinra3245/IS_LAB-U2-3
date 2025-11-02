// /frontend/app.js (El Controlador)

import * as api from './api.js';
import * as ui from './ui.js';

// --- Estado de la Aplicación ---
const taskCache = new Map();

// --- Lógica de Negocio / Funciones Reutilizables ---

/**
 * FUNCIÓN REFACTORIZADA: Carga tareas desde la API (con o sin query)
 * y las renderiza en la UI.
 */
async function loadTasks(query = '') {
    try {
        const tasks = await api.getTasks(query); // 1. Llama a la API
        ui.clearTaskList(); // 2. Limpia la lista
        
        taskCache.clear();
        tasks.forEach(task => {
            taskCache.set(task.id.toString(), task);
            ui.renderTask(task); // 3. Renderiza las tareas
        });
        
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        alert('No se pudieron cargar las tareas.');
    }
}

// --- Manejadores de Eventos (Event Handlers) ---

/**
 * Carga inicial de tareas al cargar la página
 */
async function handlePageLoad() {
    await loadTasks(); // Llama a la nueva función sin query
}

/**
 * NUEVA FUNCIÓN: Maneja la escritura en la barra de búsqueda.
 */
async function handleSearch(event) {
    const query = event.target.value.trim(); 
    await loadTasks(query); // Llama a loadTasks con el query
}

/**
 * Maneja el envío del formulario (Crear o Editar)
 */
async function handleSubmitForm(event) {
    event.preventDefault();
    
    const taskData = ui.getFormData();

    if (!taskData.title) {
        alert('El título de la tarea no puede estar vacío.');
        return;
    }

    // Decidimos si estamos Creando o Editando
    if (taskData.id) {
        // --- Lógica de Edición ---
        try {
            const updatedTask = await api.updateTaskContent(taskData.id, taskData);
            
            taskCache.set(updatedTask.id.toString(), updatedTask);
            const taskElement = ui.findTaskElementById(updatedTask.id);
            if (taskElement) {
                ui.updateTaskInUI(taskElement, updatedTask);
            }
            
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
            alert(`Error al actualizar: ${error.message}`);
        }
    } else {
        // --- Lógica de Creación ---
        try {
            const newTask = await api.createTask(taskData);
            
            taskCache.set(newTask.id.toString(), newTask);
            ui.renderTask(newTask); // Renderiza al principio

        } catch (error) {
            console.error('Error al crear tarea:', error);
            alert(`Error al crear: ${error.message}`);
        }
    }
    
    ui.resetForm();
}


/**
 * Maneja los clics en los botones de la lista (delegación)
 */
async function handleClickOnTaskList(event) {
    const target = event.target;
    const taskElement = target.closest('.task-item');

    if (!taskElement) return;

    const taskId = taskElement.getAttribute('data-id');

    try {
        // Acción: Eliminar
        if (target.classList.contains('delete-btn')) {
            if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
            
            await api.deleteTask(taskId);
            taskCache.delete(taskId);
            ui.removeTaskFromUI(taskElement);
        }
        
        // Acción: Completar/Deshacer
        if (target.classList.contains('complete-btn')) {
            const updatedTask = await api.toggleTaskStatus(taskId);
            taskCache.set(updatedTask.id.toString(), updatedTask);
            ui.updateTaskInUI(taskElement, updatedTask); 
        }
        
        // Acción: Editar
        if (target.classList.contains('edit-btn')) {
            const taskToEdit = taskCache.get(taskId);
            if (taskToEdit) {
                ui.loadTaskIntoForm(taskToEdit);
            }
        }

    } catch (error) {
        console.error('Error en acción de tarea:', error);
        alert(`Error: ${error.message}`);
    }
}

// --- Inicialización ---

// "Cableamos" los event listeners a sus manejadores
window.addEventListener('DOMContentLoaded', handlePageLoad);
ui.taskForm.addEventListener('submit', handleSubmitForm);
ui.taskList.addEventListener('click', handleClickOnTaskList);

// NUEVO LISTENER AÑADIDO
ui.searchBar.addEventListener('input', handleSearch);