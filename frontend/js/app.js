// /frontend/app.js (El Controlador)

import * as api from './api.js';
import * as ui from './ui.js';

// --- Estado de la Aplicación ---
// Mantenemos un caché local de las tareas para un acceso rápido (ej. para editar)
const taskCache = new Map();

// --- Manejadores de Eventos (Event Handlers) ---

/**
 * Carga inicial de tareas al cargar la página
 */
async function handlePageLoad() {
    try {
        const tasks = await api.getTasks();
        ui.clearTaskList();
        
        // Limpiamos y poblamos el caché y la UI
        taskCache.clear();
        tasks.forEach(task => {
            taskCache.set(task.id.toString(), task);
            ui.renderTask(task);
        });
        
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        alert('No se pudieron cargar las tareas.');
    }
}

/**
 * Maneja el envío del formulario (Crear o Editar)
 */
async function handleSubmitForm(event) {
    event.preventDefault();
    
    const taskData = ui.getFormData();

    // Validación (Requisito)
    if (!taskData.title) {
        alert('El título de la tarea no puede estar vacío.');
        return;
    }

    // Decidimos si estamos Creando o Editando
    const editingId = ui.taskForm.dataset.editingId;

    try {
        if (editingId) {
            // --- Modo Edición (UPDATE) ---
            const updatedTask = await api.updateTaskContent(editingId, taskData);
            
            // Actualizar caché
            taskCache.set(updatedTask.id.toString(), updatedTask);
            
            // Actualizar UI
            const taskElement = ui.taskList.querySelector(`[data-id="${editingId}"]`);
            if (taskElement) {
                ui.updateTaskInUI(taskElement, updatedTask);
            }
            
            ui.resetFormToCreateMode();

        } else {
            // --- Modo Creación (CREATE) ---
            const newTask = await api.createTask(taskData);
            
            // Actualizar caché y UI
            taskCache.set(newTask.id.toString(), newTask);
            ui.renderTask(newTask);
            
            ui.resetFormToCreateMode(); // Resetea el formulario después de crear
        }

    } catch (error) {
        console.error('Error al guardar la tarea:', error);
        alert(`Hubo un error al guardar: ${error.message}`);
    }
}

/**
 * Maneja los clics en la lista de tareas (Completar, Eliminar, Editar)
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
            ui.updateTaskInUI(taskElement, updatedTask); // Re-usamos la función de UI
        }
        
        // Acción: Editar
        if (target.classList.contains('edit-btn')) {
            // Obtenemos la tarea completa desde nuestro caché local
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