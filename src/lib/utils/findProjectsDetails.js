import { doc, getDoc } from "@firebase/firestore";
import { db } from "../firebaseConfig";

export const findProjectsDetails =async (projectsArray) => {
  try {
    let projectsDetailsArray = [];
    projectsArray.map(async (project) => {
      const projectRef = doc(db, "projects", project);
      const projectSnap = await getDoc(projectRef);
      if (projectSnap.exists()) {
        projectsDetailsArray.push({
          id: projectSnap.id,
          ...projectSnap.data(),
        });
      }
    });
    return projectsDetailsArray;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
