// /frontend/ui.js
// --- Exportación de Elementos del DOM ---\r
export const taskForm = document.getElementById('task-form');
export const taskTitleInput = document.getElementById('task-title2');
export const taskDescriptionInput = document.getElementById('task-description2');
export const taskList = document.getElementById('task-list');
export const searchBar = document.getElementById('search-bar');
export const submitButton = document.getElementById('sub-button');
const submitButtonText = submitButton.querySelector('.button__text');

//Elementos para prioridad y archivado
export const taskIdInput = document.getElementById('task-id');
export const taskPriorityInput = document.getElementById('task-priority');
export const toggleArchiveViewBtn = document.getElementById('toggle-archive-view-btn');
export const tasksTitleHeading = document.getElementById('tasks-title-heading');


// --- Funciones de Renderizado ---

export function renderTask(task) {
    const element = createTaskElement(task);
    taskList.prepend(element);
}

export function clearTaskList() {
    taskList.innerHTML = '';
}

export function updateTaskInUI(element, task) {
    element.setAttribute('data-title', task.title);
    element.setAttribute('data-description', task.description || '');
    element.setAttribute('data-priority', task.priority);
    element.setAttribute('data-archived', task.archived);

    element.querySelector('h3').textContent = task.title;
    element.querySelector('p').textContent = task.description || 'Sin descripción';

    updateTaskVisuals(element, task);
}

export function removeTaskFromUI(element) {
    element.remove();
}

export function findTaskElementById(taskId) {
    return taskList.querySelector(`.task-item[data-id="${taskId}"]`);
}

// --- Funciones del Formulario ---

export function getFormData() {
    const editingId = taskIdInput.value;
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const priority = parseInt(taskPriorityInput.value, 10); // MODIFICADO

    if (!title) {
        throw new Error('El título es obligatorio.');
    }

    return { editingId, title, description, priority }; // MODIFICADO
}

export function clearForm() {
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
    taskIdInput.value = ''; // NUEVO
    taskPriorityInput.value = '2'; // NUEVO
    
    submitButtonText.textContent = 'Añadir Tarea'; 
    taskTitleInput.focus();
}

export function loadTaskIntoForm(task) {
    taskIdInput.value = task.id; // NUEVO
    taskTitleInput.value = task.title;
    taskDescriptionInput.value = task.description || '';
    taskPriorityInput.value = task.priority; // NUEVO
    
    submitButtonText.textContent = 'Actualizar Tarea'; 
    taskTitleInput.focus();
}

// --- Funciones Privadas (Helpers) ---

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    
    // Todos los data-attributes
    taskElement.setAttribute('data-id', task.id);
    taskElement.setAttribute('data-title', task.title);
    taskElement.setAttribute('data-description', task.description || '');
    taskElement.setAttribute('data-completed', task.completed);
    taskElement.setAttribute('data-priority', task.priority);
    taskElement.setAttribute('data-archived', task.archived);

    let priorityText = 'Media';
    if (task.priority === 1) priorityText = 'Alta';
    if (task.priority === 3) priorityText = 'Baja';

    // archivar y prioridad
    taskElement.innerHTML = `
        <div class="task-content">
            <h3>${task.title}</h3>
            <p>${task.description || 'Sin descripción'}</p>
            <span class="status"></span>
            <span class="task-priority">Prioridad: ${priorityText}</span>
        </div>
        <div class="task-actions">
            <button class="edit-btn">Editar</button>
            <button class="complete-btn"></button>
            <button class="archive-btn"></button> 
            <button class="delete-btn">Eliminar</button>
        </div>
    `;

    updateTaskVisuals(taskElement, task);
    return taskElement;
}

function updateTaskVisuals(element, task) {
    const statusSpan = element.querySelector('.status');
    const completeBtn = element.querySelector('.complete-btn');
    const archiveBtn = element.querySelector('.archive-btn'); // NUEVO
    
    element.classList.toggle('completed', task.completed);
    statusSpan.textContent = task.completed ? 'Completada' : 'Pendiente';
    statusSpan.className = `status ${task.completed ? 'status-completed' : 'status-pending'}`;
    completeBtn.textContent = task.completed ? 'Deshacer' : 'Completar';
    
    // Lógica de archivado
    archiveBtn.textContent = task.archived ? 'Desarchivar' : 'Archivar';
    
    if (task.archived) {
        completeBtn.style.display = 'none';
        archiveBtn.style.marginLeft = 'auto';
    } else {
        completeBtn.style.display = 'inline-block';
        archiveBtn.style.marginLeft = '0';
    }
}