
const { addTask } = require('../backend/tasks');
test('Agrega una tarea correctamente a una lista vacía', () => {
    const tasks = [];
    const title = 'Comprar víveres';
    const description = 'Leche, pan y huevos';
    const newTask = addTask(tasks, title, description);
    expect(newTask.title).toBe(title);
    expect(tasks.length).toBe(1);
});