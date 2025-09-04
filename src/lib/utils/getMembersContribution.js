import { collection, query, where, getDocs } from "@firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export async function getMemberContribution(projectId) {
  const q = query(collection(db, "tasks"), where("projectId", "==", projectId));
  const snap = await getDocs(q);

  //TODO Change in future, remove calling db and fetch from the project dashboard
  //   let contributions: Record<string, { assigned: number, completed: number }> =
  //     {};

  let contributions = {};

  snap.forEach((doc) => {
    const t = doc.data();
    if (!contributions[t.assignedTo])
      contributions[t.assignedTo] = { assigned: 0, completed: 0 };
    contributions[t.assignedTo].assigned++;
    if (t.status === "done") contributions[t.assignedTo].completed++;
  });

  return contributions;
}
