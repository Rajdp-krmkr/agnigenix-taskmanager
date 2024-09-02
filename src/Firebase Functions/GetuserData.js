import { db } from "@/lib/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "@firebase/firestore";

const GetUserData = (user) => {
  const { uid } = user;
  console.log("uid from getuserdata:", uid);

  return new Promise(async (resolve, reject) => {
    // const docRef = doc(db, "users", uid);
    // const docSnap = await getDoc(docRef);

    const docs = collection(db, "users");
    const q = query(docs, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      reject("No data found for uid");
    } else {
      querySnapshot.forEach((doc) => {
        console.log({ ...doc.data() });
        resolve(doc.data());
      });
    }

    // if (q.) {
    //   resolve(docSnap.data());
    // } else {
    //   reject(new Error(`No data found for uid: ${uid}`));
    // }
  });
};

export default GetUserData;

const GetUserDataByUsername = (user) => {
  const { username } = user;
  return new Promise(async (resolve, reject) => {
    const docRef = doc(db, "users", username);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      resolve(docSnap.data());
    } else {
      reject("didn't get any data");
    }
  });
};

export { GetUserDataByUsername };
