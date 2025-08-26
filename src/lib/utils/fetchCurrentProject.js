import { doc, getDoc } from "@firebase/firestore";
import { db } from "../firebaseConfig";

export default async function fetchCurrentProject(projectId) {
  // Implementation for fetching the current project
  try {
    const projectRef = doc(db, "projects", projectId);
    const projectSnapshot = await getDoc(projectRef);
    if (projectSnapshot.exists()) {
      console.log("Project fetched successfully:", projectSnapshot.data());
      return projectSnapshot.data();
    } else {
      console.log("Project not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}
