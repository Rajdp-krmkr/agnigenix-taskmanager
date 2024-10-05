import { db } from "@/lib/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "@firebase/firestore";

const GetNotifications = (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = collection(db, "users", username + "/notifications");
      await getDocs(docRef).then((querySnapsahot) => {
        const arr = [];
        querySnapsahot.forEach((doc) => {
          arr.push(doc.data());
          // console.log(doc.data());
        });
        resolve(arr);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default GetNotifications;

export const updateNotifications = (username, notification) => {
  const notificationID = notification.uid;
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(
        db,
        "users",
        username + "/notifications" + "/" + notificationID
      );
      const docSnap = await updateDoc(docRef, notification);
      console.log("notification Updated");
      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

export const PostNotifications = (username, notificationID, notification) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(
        db,
        "users",
        username + "/notifications" + "/" + notificationID
      );
      await setDoc(docRef, notification)
        .then(() => {
          console.log("notification Posted");
          resolve("done");
        })
        //!etodur hoyeche
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};
