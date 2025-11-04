// /frontend/ui.js
// --- Exportación de Elementos del DOM ---
export const taskForm = document.getElementById('task-form');
export const taskTitleInput = document.getElementById('task-title2');
export const taskDescriptionInput = document.getElementById('task-description2');
export const taskList = document.getElementById('task-list');

// LÍNEA AÑADIDA
export const searchBar = document.getElementById('search-bar');
export const submitButton = document.getElementById('sub-button');
const submitButtonText = submitButton.querySelector('.button__text');

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

    element.querySelector('h3').textContent = task.title;
    element.querySelector('p').textContent = task.description || 'Sin descripción';

    updateTaskStatusAppearance(element, task);
}

export function removeTaskFromUI(element) {
    element.remove();
}

export function findTaskElementById(taskId) {
    return taskList.querySelector(`.task-item[data-id="${taskId}"]`);
}

// --- Funciones del Formulario ---

export function getFormData() {
    const id = taskForm.dataset.editingId;
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    return { id, title, description };
}

export function resetForm() {
    taskForm.reset();
    delete taskForm.dataset.editingId;
    submitButtonText.textContent = 'Añadir Tarea'; 
    taskTitleInput.focus();
}

export function loadTaskIntoForm(task) {
    taskForm.dataset.editingId = task.id;
    taskTitleInput.value = task.title;
    taskDescriptionInput.value = task.description || '';
    submitButtonText.textContent = 'Actualizar'; 
    taskTitleInput.focus();
}

// --- Funciones Privadas (Helpers) ---

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.setAttribute('data-id', task.id);
    taskElement.setAttribute('data-title', task.title);
    taskElement.setAttribute('data-description', task.description || '');
    taskElement.setAttribute('data-completed', task.completed);

    taskElement.innerHTML = `
        <div class="task-content">
            <h3>${task.title}</h3>
            <p>${task.description || 'Sin descripción'}</p>
            <span class="status"></span>
        </div>
        <div class="task-actions">
            <button class="edit-btn">Editar</button>
            <button class="complete-btn"></button>
            <button class="delete-btn">Eliminar</button>
        </div>
    `;

    updateTaskStatusAppearance(taskElement, task);
    return taskElement;
}

function updateTaskStatusAppearance(element, task) {
    const statusSpan = element.querySelector('.status');
    const completeBtn = element.querySelector('.complete-btn');
    
    element.classList.toggle('completed', task.completed);
    
    statusSpan.textContent = task.completed ? 'Completada' : 'Pendiente';
    statusSpan.className = `status ${task.completed ? 'completed' : 'pending'}`;
    
    completeBtn.textContent = task.completed ? 'Deshacer' : 'Completar';
}