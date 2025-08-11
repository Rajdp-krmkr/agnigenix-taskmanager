import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, getDocs } from "@firebase/firestore";

const CheckUserName = async (username) => {
  // const docRef = doc(db, "users", username);
  // const docSnap = await getDoc(docRef);
  const docCollectionRef = collection(db, "users");
  const q = query(docCollectionRef, where("username", "==", username));
  const docSnap = await getDocs(q);
  return new Promise((resolve, reject) => {
    if (!docSnap.empty) {
      resolve(true);
    } else {
      reject(false);
    }
  });
};

export default CheckUserName;
