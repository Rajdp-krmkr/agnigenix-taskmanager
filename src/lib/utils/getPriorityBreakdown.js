export function getPriorityBreakdown(tasks) {
  let breakdown = { low: 0, medium: 0, high: 0 };
  tasks.forEach((t) => breakdown[t.priority]++);
  return breakdown;
}
