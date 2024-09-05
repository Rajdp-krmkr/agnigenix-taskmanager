import { db } from "@/lib/firebaseConfig";
import { collection, doc, getDoc, getDocs, query, where } from "@firebase/firestore";

const IsUserExist = (user) => {
  const { uid } = user;
  return new Promise(async (resolve, reject) => {
    const docs = collection(db, "users");
    const q = query(docs, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        resolve(doc.data());
      });
    } else {
      reject(false);
    }
  });
};

export default IsUserExist;
