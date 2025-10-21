// /frontend/app.js
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDescription = document.getElementById('task-description');
const taskList = document.getElementById('task-list');



taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();

    if (!title) {
        alert('El título de la tarea no puede estar vacío.');
        return;
    }

    // Objeto de la nueva tarea
    const taskData = { title, description };

    // ...
    try {
        const response = await fetch('/tasks', {
            method: 'POST', // Routing/endpoints REST 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        });

        if (!response.ok) {
            // Manejo de errores de la persistencia/servidor 
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const newTask = await response.json(); // Recibe la tarea guardada (con ID, estado, etc.)

        // Paso 5: Renderizar la nueva tarea
        renderTask(newTask);


        taskTitle.value = '';
        taskDescription.value = '';

    } catch (error) {
        console.error('Error al agregar la tarea:', error);
        alert('Hubo un error al guardar la tarea. Consulta la consola.');
    }
});


function renderTask(task) {
    // 1. Crear el elemento contenedor principal (e.g., un <div>)
    const taskElement = document.createElement('div'); // Crea un nuevo nodo 
    taskElement.className = 'task-item'; // Agrega estilos para distinguirlo

    // Se usa un atributo de datos para referencia futura (ej. para la HU2, HU3 o eliminar)
    taskElement.setAttribute('data-id', task.id);

    // 2. Definir el contenido interno del elemento (HTML)
    // Se incluye el título, la descripción y un marcador de estado.
    taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description || 'Sin descripción'}</p>
        <span class="${task.completed ? 'completed' : 'pending'}">
            ${task.completed ? 'Completada' : 'Pendiente'}
        </span>
        `;

    // 3. Insertar el nuevo nodo al DOM 
    // Usamos 'prepend' para que las tareas más nuevas aparezcan arriba.
    taskList.prepend(taskElement); // taskList es la referencia a <div id="task-list">

    // Opcional: Esto ayuda a que el usuario sepa que la tarea se agregó
    console.log(`Tarea agregada al DOM: ${task.title}`);
}