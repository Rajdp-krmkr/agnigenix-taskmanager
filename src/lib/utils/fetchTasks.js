import { query, collection, getDocs, where } from "@firebase/firestore";
import { db } from "../firebaseConfig";

export const fetchTasks = async (id) => {
  try {
    const q = query(collection(db, "tasks"), where("projectId", "==", id));
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);

    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    

    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};
