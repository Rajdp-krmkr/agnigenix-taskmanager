import {
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../firebaseConfig";

export const createProjectInFirestore = async (projectData, workspaceID) => {
  try {
    const projectRef = doc(collection(db, "projects"));
    await setDoc(projectRef, {
      ...projectData,
      id: projectRef.id,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    const workspaceRef = doc(db, "workspaces", workspaceID);

    await updateDoc(workspaceRef, {
      projects: arrayUnion(projectRef.id),
    });

    return projectRef.id;
  } catch (error) {
    throw error;
  }
};
