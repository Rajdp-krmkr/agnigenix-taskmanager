export async function getMemberContribution(tasks) {
  let contributions = {};

  tasks.forEach((doc) => {
    const t = doc;
    if (!contributions[t.assignedTo])
      contributions[t.assignedTo] = { assigned: 0, completed: 0 };
    contributions[t.assignedTo].assigned++;
    if (t.status === "done") contributions[t.assignedTo].completed++;
  });

  return contributions;
}
