export function getAverageCompletionTime(tasks) {
  let totalTime = 0,
    count = 0;

  tasks.forEach((t) => {
    if (t.status === "done" && t.completedAt) {
      const start = new Date(t.createdAt).getTime();
      const end = new Date(t.completedAt).getTime();
      totalTime += end - start;
      count++;
    }
  });

  return count ? totalTime / count / (1000 * 60 * 60) : 0; // avg hours
}
