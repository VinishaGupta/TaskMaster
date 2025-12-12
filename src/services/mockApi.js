// Mock API: localStorage + 500ms delay + 10% random failure
const STORAGE_KEY = "tm_tasks_v1";

function delay(ms = 500) {
  return new Promise((res) => setTimeout(res, ms));
}

// 10% chance
function randomFail() {
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
  } catch {}
}

// Helper → throws formatted error (useful for retry logic)
function apiError(message) {
  const err = new Error(message);
  err.isApiError = true; // flag for retry logic
  return err;
}

// ----------------------------------------------------
// FETCH
// ----------------------------------------------------
export async function fetchTodos() {
  await delay();

  if (randomFail()) throw apiError("Network error: Failed to load tasks");

  let list = loadFromStorage();

  if (!list || list.length === 0) {
    list = [
      { id: Date.now() - 1234, text: "Sample Task 1", completed: false },
    ];
    saveToStorage(list);
  }

  return { success: true, data: list };
}

// ----------------------------------------------------
// ADD
// ----------------------------------------------------
export async function addTodo({ text }) {
  await delay();

  if (randomFail()) throw apiError("Failed to add task");

  const list = loadFromStorage();
  const newTodo = { id: Date.now(), text, completed: false };

  list.push(newTodo);
  saveToStorage(list);

  return { success: true, data: newTodo };
}

// ----------------------------------------------------
// DELETE
// ----------------------------------------------------
export async function deleteTodo(id) {
  await delay();

  if (randomFail()) throw apiError("Failed to delete task");

  const list = loadFromStorage().filter((t) => t.id !== id);
  saveToStorage(list);

  return { success: true };
}

// ----------------------------------------------------
// EDIT
// ----------------------------------------------------
export async function editTodo(id, text) {
  await delay();

  if (randomFail()) throw apiError("Failed to edit task");

  const list = loadFromStorage().map((t) =>
    t.id === id ? { ...t, text } : t
  );

  saveToStorage(list);

  return { success: true, data: list.find((t) => t.id === id) };
}

// ----------------------------------------------------
// TOGGLE COMPLETE
// ----------------------------------------------------
export async function toggleTodo(id) {
  await delay();

  if (randomFail()) throw apiError("Failed to update task");

  const list = loadFromStorage().map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );

  saveToStorage(list);

  return { success: true, data: list.find((t) => t.id === id) };
}

// ----------------------------------------------------
// REORDER (used for drag & drop)
// ----------------------------------------------------
export async function reorderTodos(sourceIndex, destIndex) {
  await delay();

  if (randomFail()) throw apiError("Failed to reorder tasks");

  const list = loadFromStorage();
  const moved = list.splice(sourceIndex, 1)[0];
  list.splice(destIndex, 0, moved);

  saveToStorage(list);

  return { success: true, data: list };
}
