import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "@firebase/firestore";

const getProjects = (workspaceID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = collection(db, "workspaces", workspaceID + "/projects");
      await getDocs(docRef).then((querySnapsahot) => {
        const arr = [];
        querySnapsahot.forEach((doc) => {
          arr.push(doc.data());
          console.log(doc.data());
        });
        resolve(arr);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default getProjects;
