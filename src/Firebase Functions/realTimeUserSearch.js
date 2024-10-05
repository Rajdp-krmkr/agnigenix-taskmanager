import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "@firebase/firestore";

const realTimeUserSearch = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const docs = collection(db, "users");
      const querySnapshot = await getDocs(docs);

      const usersList = querySnapshot.docs.map((doc) => ({
        username: doc.id, // Document ID (UID)
        name: doc.data().name, // Internal document data
        email: doc.data().email, // Internal document data
        photoURL: doc.data().photoURL, // Internal document
        uid: doc.data().uid, // Internal document data
      }));
      usersList.sort((a, b) => a.username.localeCompare(b.username));

      console.log("users collection", usersList);
      resolve(usersList);
    } catch (error) {
      console.log(error);
      reject(null);
    }
  });
};

export default realTimeUserSearch;

export const realTimeUserSearchForProject = (workspaceMembersArray) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const docs = collection(db, "users");
      // const querySnapshot = await getDocs(docs);
      const usersList = workspaceMembersArray.map((doc) => ({
        username: doc.id, // Document ID (UID)
        name: doc.data().name, // Internal document data
        email: doc.data().email, // Internal document data
        photoURL: doc.data().photoURL, // Internal document
        uid: doc.data().uid, // Internal document data
      }));
      usersList.sort((a, b) => a.username.localeCompare(b.username));

      console.log("workspace users collection", usersList);
      resolve(usersList);
    } catch (error) {
      console.log(error);
      reject(null);
    }
  });
};

