// /frontend/app.js
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDescription = document.getElementById('task-description');
const taskList = document.getElementById('task-list');

// API Endpoint
const API_URL = '/tasks';

/**
 * 1. Cargar tareas al iniciar la aplicación (HU-01)
 */
window.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const tasks = await response.json();
        
        // Limpiamos la lista antes de renderizar (por si acaso)
        taskList.innerHTML = ''; 
        
        tasks.forEach(renderTask);
        
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        alert('No se pudieron cargar las tareas.');
    }
}


/**
 * 2. Manejar el envío del formulario para crear nuevas tareas (C)
 */
taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();

    // Validación de campo vacío (requisito)
    if (!title) {
        alert('El título de la tarea no puede estar vacío.');
        return;
    }

    const taskData = { title, description };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const newTask = await response.json();
        
        // Renderizar la nueva tarea
        renderTask(newTask);

        // Limpiar formulario
        taskTitle.value = '';
        taskDescription.value = '';

    } catch (error) {
        console.error('Error al agregar la tarea:', error);
        alert('Hubo un error al guardar la tarea.');
    }
});


/**
 * 3. Manejar acciones de Tarea (Completar y Eliminar) usando Delegación de Eventos (U, D)
 */
taskList.addEventListener('click', (event) => {
    // El 'event.target' es el elemento exacto donde se hizo clic (ej. el botón)
    const target = event.target;
    
    // Buscamos el elemento 'task-item' padre más cercano
    const taskElement = target.closest('.task-item');

    // Si no se hizo clic dentro de un 'task-item', no hacemos nada
    if (!taskElement) return;

    // Obtenemos el ID de la tarea desde el 'data-id'
    const taskId = taskElement.getAttribute('data-id');

    // Acción: Eliminar Tarea (HU-03)
    if (target.classList.contains('delete-btn')) {
        handleDeleteTask(taskId, taskElement);
    }
    
    // Acción: Completar Tarea (HU-02)
    if (target.classList.contains('complete-btn')) {
        handleToggleComplete(taskId, taskElement);
    }
});

async function handleDeleteTask(id, element) {
    // Confirmación (Validación de eliminación)
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        // 3. Manipulación del DOM: Remoción de nodo
        element.remove(); 

    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        alert('No se pudo eliminar la tarea.');
    }
}

async function handleToggleComplete(id, element) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const updatedTask = await response.json();
        
        // 3. Manipulación del DOM: Actualización de estado
        updateTaskAppearance(element, updatedTask);

    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
        alert('No se pudo actualizar el estado de la tarea.');
    }
}


/**
 * 4. Función de Renderizado (Manipulación del DOM)
 * (Modificada para incluir botones de acción)
 */
function renderTask(task) {
    // 1. Crear el elemento contenedor
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    
    // Usamos un atributo de datos para referencia (CRUD)
    taskElement.setAttribute('data-id', task.id);

    // 2. Definir el contenido interno (HTML)
    taskElement.innerHTML = `
        <div class="task-content">
            <h3>${task.title}</h3>
            <p>${task.description || 'Sin descripción'}</p>
            <span class="status ${task.completed ? 'completed' : 'pending'}">
                ${task.completed ? 'Completada' : 'Pendiente'}
            </span>
        </div>
        <div class="task-actions">
            <button class="complete-btn">
                ${task.completed ? 'Deshacer' : 'Completar'}
            </button>
            <button class="delete-btn">Eliminar</button>
        </div>
    `;
    
    // 3. Actualizar la apariencia inicial
    updateTaskAppearance(taskElement, task);

    // 4. Insertar el nodo al DOM (prepend para ver las nuevas primero)
    taskList.prepend(taskElement);
}

/**
 * 5. Función Auxiliar para actualizar el DOM (Estado visual)
 */
function updateTaskAppearance(element, task) {
    // Actualizar la clase del contenedor (para estilos CSS)
    if (task.completed) {
        element.classList.add('completed');
    } else {
        element.classList.remove('completed');
    }
    
    // Actualizar el texto y clase del tag de estado
    const statusSpan = element.querySelector('.status');
    statusSpan.textContent = task.completed ? 'Completada' : 'Pendiente';
    statusSpan.className = `status ${task.completed ? 'completed' : 'pending'}`;

    // Actualizar el texto del botón de completar
    const completeBtn = element.querySelector('.complete-btn');
    completeBtn.textContent = task.completed ? 'Deshacer' : 'Completar';
}