// Mock API: localStorage + 500ms delay + 10% random failure (as required)
const STORAGE_KEY = "tm_tasks_v1";

function delay(ms = 500) {
  return new Promise((res) => setTimeout(res, ms));
}

function randomFail() {
  // 10% chance to fail per assignment
  return Math.random() < 0.1;
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveToStorage(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    // ignore
  }
}

export async function fetchTodos() {
  await delay();
  if (randomFail()) throw new Error("Failed to fetch tasks (network)");
  const data = loadFromStorage();
  if (!data || data.length === 0) {
    const sample = [
      { id: Date.now() - 2000, text: "Sample Task 1", completed: false },
      { id: Date.now() - 1000, text: "Sample Task 2", completed: true },
    ];
    saveToStorage(sample);
    return sample;
  }
  return data;
}

export async function addTodo({ text }) {
  await delay();
  if (randomFail()) throw new Error("Failed to add task");
  const list = loadFromStorage();
  const newTodo = { id: Date.now(), text, completed: false };
  list.push(newTodo);
  saveToStorage(list);
  return newTodo;
}

export async function deleteTodo(id) {
  await delay();
  if (randomFail()) throw new Error("Failed to delete task");
  const list = loadFromStorage().filter((t) => t.id !== id);
  saveToStorage(list);
  return true;
}

export async function editTodo(id, text) {
  await delay();
  if (randomFail()) throw new Error("Failed to edit task");
  const list = loadFromStorage().map((t) => (t.id === id ? { ...t, text } : t));
  saveToStorage(list);
  return list.find((t) => t.id === id);
}

export async function toggleTodo(id) {
  await delay();
  if (randomFail()) throw new Error("Failed to update task");
  const list = loadFromStorage().map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveToStorage(list);
  return list.find((t) => t.id === id);
}
