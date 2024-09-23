import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDocs, setDoc } from "@firebase/firestore";

const AddTask = (username, taskID, yourtask) => {
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

export const fetchAllTasks = (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "users", username + "/tasks")
      );
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push(doc.data());
        console.log(doc.data());
      });
      resolve(tasks);
    } catch (error) {
      console.error("Error getting documents: ", error);
      reject();
    }
  });
};

export const setTaskCompleted = (username, taskID) => {
  return new Promise(async (resolve, reject) => {
    try {
      const taskRef = doc(db, "users", username + "/tasks" + "/" + taskID);
      await setDoc(taskRef, { isCompleted: true }, { merge: true });
      console.log("task completed");
      resolve();
    } catch (error) {
      console.error("Error updating document: ", error);
      reject();
    }
  });
};
