// /backend/tasks.js (Versión refactorizada)

/**
 * Responsabilidad Única: Crea un objeto de tarea con propiedades iniciales.
 * @param {string} title
 * @param {string} description
 * @returns {object} La nueva estructura de la tarea.
 */
function createTaskObject(title, description) {
    return {
        id: Date.now(), // ID simple
        title,           // Simplificación (propiedad de objeto concisa)
        description,
        completed: false,
        createdAt: new Date().toISOString()
    };
}

/**
 * Responsabilidad Única: Agrega una nueva tarea a la lista de persistencia.
 * @param {Array} tasks - La lista donde se guardarán las tareas.
 * @param {string} title
 * @param {string} description
 * @returns {object} La tarea creada.
 */
function addTask(tasks, title, description) {
    // 1. Usa la función extraída para crear el objeto.
    const newTask = createTaskObject(title, description); 
    // 2. Persistencia (Guardado)
    tasks.push(newTask);
    return newTask;
}

module.exports = { addTask }; // Solo exportamos addTask, que es la API