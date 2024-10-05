import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "@firebase/firestore";

const createProject = (workspaceid, projectid, projectObject) => {

  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(
        db,
        "workspaces",
        workspaceid + "/projects" + "/" + projectid
      );
      await setDoc(docRef, projectObject);
      console.log("Document written with ID: ", docRef.id);
      // console.log(workspaceid);
      resolve(workspaceid);
    } catch (error) {
      reject(error);
    }
  });
};

export default createProject;
