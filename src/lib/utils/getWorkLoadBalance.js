function getWorkload(tasks) {
  //   let workload: Record<string, { low: number, medium: number, high: number }> =
  //     {};
  
  let workload = {};

  tasks.forEach((t) => {
    if (!workload[t.assignedTo])
      workload[t.assignedTo] = { low: 0, medium: 0, high: 0 };
    workload[t.assignedTo][t.priority]++;
  });

  return workload;
}
