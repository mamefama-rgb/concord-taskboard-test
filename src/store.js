// In-memory task store. Resets on every restart (on purpose: keeps the demo simple).
let tasks = [];
let nextId = 1;

function list() {
  return tasks;
}

function create({ title }) {
  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  return task;
}

function update(id, changes) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return null;
  if (typeof changes.title === "string") task.title = changes.title;
  if (typeof changes.done === "boolean") task.done = changes.done;
  return task;
}

function remove(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

function reset() {
  tasks = [];
  nextId = 1;
}

module.exports = { list, create, update, remove, reset };
