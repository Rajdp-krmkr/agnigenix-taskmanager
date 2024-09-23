import { db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "@firebase/firestore";

const AddTask = (username, taskID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, "users", username + "/tasks" + "/" + taskID);
      await setDoc(docRef, yourtask)
        .then(() => {
          console.log(`task stored with ${taskID} id`);
          resolve();
        })
        .catch(() => {
          console.error(`task not stored with ${taskID} id`);
          reject();
        });
    } catch (error) {
      console.error("Error adding document: ", error);
      reject();
    }
  });
};

export default AddTask;
