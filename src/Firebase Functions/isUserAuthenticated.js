import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "@firebase/firestore";

const isUserAuthenticated = ({ username, uid }) => {
  return new Promise(async (resolve, reject) => {
    const docRef = doc(db, "users", username);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      docSnap.data().uid == uid ? resolve(true) : reject(false);
    } else {
      reject(false);
    }
  });
};

export default isUserAuthenticated;
