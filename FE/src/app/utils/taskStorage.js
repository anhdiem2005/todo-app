export function addTaskToList(tasks, task) {
  return [...tasks, { ...task, id: Date.now(), subtasks: task.subtasks ?? [] }];
}

export function updateTaskInList(tasks, id, updates) {
  return tasks.map((task) => (task.id === id ? { ...task, ...updates } : task));
}

export function deleteTaskFromList(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function toggleTaskStatus(tasks, id) {
  return tasks.map((task) =>
    task.id === id
      ? { ...task, status: task.status === "Done" ? "To Do" : "Done" }
      : task
  );
}

export function loadTasksFromStorage(defaultTasks = []) {
  try {
    const stored = localStorage.getItem("todo_tasks");
    if (!stored) return defaultTasks;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : defaultTasks;
  } catch {
    return defaultTasks;
  }
}

export function saveTasksToStorage(tasks) {
  localStorage.setItem("todo_tasks", JSON.stringify(tasks));
}
