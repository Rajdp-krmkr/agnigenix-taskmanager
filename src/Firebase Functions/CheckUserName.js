import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "@firebase/firestore";

const CheckUserName = async (username) => {
  const docRef = doc(db, "users", username);
  const docSnap = await getDoc(docRef);
  return new Promise((resolve, reject) => {
    if (docSnap.exists()) {
      resolve(true);  
    } else {
      reject(false);
    }
  });
};

export default CheckUserName;
