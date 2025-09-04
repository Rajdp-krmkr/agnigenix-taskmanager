export function getOverdueTasks(tasks) {
  const now = new Date();
  return tasks.filter((t) => new Date(t.dueDate) < now && t.status !== "done");
}