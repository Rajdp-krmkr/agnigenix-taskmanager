import { db } from "@/lib/firebaseConfig";
import { doc, setDoc, updateDoc } from "@firebase/firestore";

const CreateWorkspace = (
  workspaceID,
  {
    workspaceTitle,
    workspaceDescription,
    isPrivate,
    LogoLetter,
    customizedLogo,
    members,
  }
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, "workspaces", workspaceID);
      await setDoc(docRef, {
        workspaceTitle: workspaceTitle,
        workspaceDescription: workspaceDescription,
        isPrivate: isPrivate,
        LogoLetter: LogoLetter,
        customizedLogo: customizedLogo,
        members: [...members],
      });
      console.log("Document written with ID: ", docRef.id);
      console.log(workspaceID);
      resolve(workspaceID);
    } catch (error) {
      reject(error);
    }
  });
};

export default CreateWorkspace;

export const updateWorkspaceinUsers = (username, [...WorkspaceArray]) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, "users", username);
      await updateDoc(docRef, {
        workspaces: WorkspaceArray,
      });
      console.log("Document written with ID: ", docRef.id);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
