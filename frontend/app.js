// /frontend/app.js 

import * as api from './api.js';
import * as ui from './ui.js';

// --- Estado de la Aplicación ---
const taskCache = new Map();
let currentView = 'active'; // NUEVO: 'active' o 'archived'

// --- Lógica de Negocio / Funciones Reutilizables ---

async function loadTasks(query = '') {
    try {
        const tasks = await api.getTasks(query); 
        ui.clearTaskList(); 
        
        taskCache.clear();
        tasks.forEach(task => {
            taskCache.set(task.id.toString(), task);
            ui.renderTask(task);
        });
        
        updateTaskView(); 
        
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        alert('No se pudieron cargar las tareas.');
    }
}

// --- Manejadores de Eventos (Event Handlers) ---

async function handlePageLoad() {
    await loadTasks(); 
    ui.taskList.classList.add('showing-active'); // Estado inicial
}

async function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    await loadTasks(query);
}

async function handleSubmitForm(event) {
    event.preventDefault();
    
    let taskData;
    try {
        taskData = ui.getFormData(); 
    } catch (error) {
        alert(error.message);
        return;
    }

    try {
        if (taskData.editingId) {
            // --- Lógica de Actualizar ---
            const updatedTask = await api.updateTaskContent(taskData.editingId, {
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority // MODIFICADO
            });
            
            taskCache.set(updatedTask.id.toString(), updatedTask);
            const taskElement = ui.findTaskElementById(updatedTask.id.toString());
            ui.updateTaskInUI(taskElement, updatedTask);

        } else {
            // --- Lógica de Crear ---
            const newTask = await api.createTask({
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority // MODIFICADO
            });
            
            taskCache.set(newTask.id.toString(), newTask);
            ui.renderTask(newTask); 
        }
        
        ui.clearForm();

    } catch (error) {
        console.error('Error al guardar la tarea:', error);
        alert(`Error: ${error.message}`);
    }
}


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

        //Acción: Archivar/Desarchivar
        if (target.classList.contains('archive-btn')) {
            const updatedTask = await api.toggleTaskArchive(taskId);
            taskCache.set(updatedTask.id.toString(), updatedTask);
            ui.updateTaskInUI(taskElement, updatedTask); 
            updateTaskView(); // Refresca la vista
        }
        
        //Acción: Editar
        if (target.classList.contains('edit-btn')) {
            const taskToEdit = taskCache.get(taskId);
            if (taskToEdit) {
                ui.loadTaskIntoForm(taskToEdit);
                window.scrollTo(0, 0);
            }
        }

    } catch (error) {
        console.error('Error en acción de tarea:', error);
        alert(`Error: ${error.message}`);
    }
}

//Maneja el clic en el botón de "Ver Archivadas"
function handleToggleArchiveView() {
    currentView = (currentView === 'active') ? 'archived' : 'active';
    updateTaskView();
}

//Actualiza la UI según la vista
function updateTaskView() {
    const buttonText = ui.toggleArchiveViewBtn.querySelector('.button__text');
    
    if (currentView === 'active') {
        ui.taskList.classList.remove('showing-archived');
        ui.taskList.classList.add('showing-active');
        buttonText.textContent = 'Ver Archivadas';
        ui.tasksTitleHeading.textContent = 'Tareas Pendientes';
    } else {
        ui.taskList.classList.remove('showing-active');
        ui.taskList.classList.add('showing-archived');
        buttonText.textContent = 'Ver Activas';
        ui.tasksTitleHeading.textContent = 'Tareas Archivadas';
    }
}


// --- Inicialización ---
window.addEventListener('DOMContentLoaded', handlePageLoad);
ui.taskForm.addEventListener('submit', handleSubmitForm);
ui.taskList.addEventListener('click', handleClickOnTaskList);
ui.searchBar.addEventListener('input', handleSearch);

//Conecta el botón de archivar
ui.toggleArchiveViewBtn.addEventListener('click', handleToggleArchiveView);