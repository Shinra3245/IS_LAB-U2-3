// /frontend/ui.js
// --- Exportación de Elementos del DOM ---
// Exportamos los elementos para que el controlador (app.js) les añada eventos
export const taskForm = document.getElementById('task-form');
export const taskTitleInput = document.getElementById('task-title');
export const taskDescriptionInput = document.getElementById('task-description');
export const taskList = document.getElementById('task-list');
const submitButton = taskForm.querySelector('button[type="submit"]');

// --- Funciones de Renderizado ---
//Renderiza una única tarea en la lista del DOM
 
export function renderTask(task) {
    const element = createTaskElement(task);
    taskList.prepend(element);
}

//Limpia la lista de tareas en el DOM
 
export function clearTaskList() {
    taskList.innerHTML = '';
}


 //Actualiza la apariencia de un elemento de tarea existente en el DOM
 
export function updateTaskInUI(element, task) {
    // Actualizar atributos de datos (importante para la edición)
    element.setAttribute('data-title', task.title);
    element.setAttribute('data-description', task.description || '');

    // Actualizar contenido visible
    element.querySelector('h3').textContent = task.title;
    element.querySelector('p').textContent = task.description || 'Sin descripción';

    // Actualizar estado (clases y botones)
    updateTaskStatusAppearance(element, task);
}

export function removeTaskFromUI(element) {
    element.remove();
}

// --- Funciones del Formulario ---
export function loadTaskIntoForm(task) {
    taskTitleInput.value = task.title;
    taskDescriptionInput.value = task.description || '';
    
    // Almacenamos el ID en el 'dataset' del formulario para saber que estamos editando
    taskForm.dataset.editingId = task.id; 
    
    // Cambiamos el estilo y texto del botón
    submitButton.textContent = 'Guardar Cambios';
    taskForm.classList.add('editing-mode');
}


//Resetea el formulario a su estado original (modo "Crear")
export function resetFormToCreateMode() {
    taskForm.reset(); // Limpia los inputs
    delete taskForm.dataset.editingId; // Quitamos el ID de edición
    
    // Devolvemos el botón a su estado original
    submitButton.textContent = 'Agregar Tarea';
    taskForm.classList.remove('editing-mode');
}


 //Obtiene los datos del formulario (título y descripción)

export function getFormData() {
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    return { title, description };
}

// --- Funciones Auxiliares (Privadas del Módulo) ---

//Crea el HTML de un elemento de tarea

function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    
    // Guardamos TODOS los datos en el dataset para un acceso fácil
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

    // Sincronizamos la apariencia (estado y botones)
    updateTaskStatusAppearance(taskElement, task);
    return taskElement;
}

//Actualiza solo los elementos visuales de estado (botón y tag)
 
function updateTaskStatusAppearance(element, task) {
    const statusSpan = element.querySelector('.status');
    const completeBtn = element.querySelector('.complete-btn');
    
    // Actualizar la clase del contenedor
    element.classList.toggle('completed', task.completed);
    
    // Actualizar el texto y clase del tag
    statusSpan.textContent = task.completed ? 'Completada' : 'Pendiente';
    statusSpan.className = `status ${task.completed ? 'completed' : 'pending'}`;
    
    // Actualizar el texto del botón
    completeBtn.textContent = task.completed ? 'Deshacer' : 'Completar';
}