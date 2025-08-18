import { collection, getDocs, query, where } from "@firebase/firestore";
import { db } from "../firebaseConfig";

export const fetchWorkspaces = async (workspacesId) => {
  const workspaces = [];
  try {
    await Promise.all(
      workspacesId.map(async (workspace) => {
        const querySnapshot = await getDocs(
          query(
            collection(db, "workspaces"),
            where("workspaceID", "==", workspace.workspaceID)
          )
        );
        querySnapshot.forEach((doc) => {
          workspaces.push(doc.data());
        });
      })
    );
  } catch (error) {
    console.error("Error fetching workspaces:", error);
  }
  console.log(workspaces);
  
  return workspaces;
};
