import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function getTaskProgress(projectId) {
  const q = query(collection(db, "tasks"), where("projectId", "==", projectId));
  const snap = await getDocs(q);

  let progress = { todo: 0, inProgress: 0, done: 0 };

  snap.forEach((doc) => {
    const task = doc.data();
    if (task.status === "todo") progress.todo++;
    if (task.status === "in-progress") progress.inProgress++;
    if (task.status === "done") progress.done++;
  });

  return progress;
}

export function getCompletionPercentage(progress) {
  const total = progress.todo + progress.inProgress + progress.done;
  if (total === 0) return 0;
  return Math.round((progress.done / total) * 100);
}