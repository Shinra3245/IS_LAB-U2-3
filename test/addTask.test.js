// /test/addTask.test.js
// Intenta importar la función que crearemos
const { addTask } = require('../backend/tasks');

test('Agrega una tarea correctamente a una lista vacía', () => {
    // 1. Arrange: Configuración inicial
    const tasks = [];
    const title = 'Comprar víveres';
    const description = 'Leche, pan y huevos';

    // 2. Act: Llamada a la función (esto fallará inicialmente)
    const newTask = addTask(tasks, title, description);

    // 3. Assert: Verificaciones esperadas
    // Verificamos que la nueva tarea tenga el título correcto [cite: 53]
    expect(newTask.title).toBe(title);
    // Verificamos que la lista original de tareas ahora tenga un elemento [cite: 54]
    expect(tasks.length).toBe(1);
});