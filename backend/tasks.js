// /backend/tasks.js
function addTask(tasks, title, description) {
    // Crear el objeto de la tarea
    const newTask = {
        id: Date.now(), // Un ID simple por ahora
        title,
        description,
        completed: false // Estado inicial
    };

    // Agregar la nueva tarea a la lista (mutando el array tasks)
    tasks.push(newTask);

    // Retornar la nueva tarea
    return newTask;
}

module.exports = { addTask };