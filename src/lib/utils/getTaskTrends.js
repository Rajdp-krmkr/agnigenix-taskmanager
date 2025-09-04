export function getTaskTrend(tasks) {
  //   let trend: Record<string, number> = {}; // key = YYYY-MM-DD

  let trend = {}; // key = YYYY-MM-DD

  tasks.forEach((t) => {
    if (t.status === "done" && t.completedAt) {
      const date = new Date(t.completedAt).toISOString().split("T")[0];
      trend[date] = (trend[date] || 0) + 1;
    }
  });

  return trend;
}
