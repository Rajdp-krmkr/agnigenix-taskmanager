import { db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "@firebase/firestore";

const StoreUserData = ({ uid, name, username, photoURL, email }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Storing UserData...");
      await setDoc(doc(db, "users", username), {
        name: name,
        username: username,
        photoURL: photoURL,
        email: email,
        uid: uid,
        bio: "",
        socialMediaAcounts: [],
        jobRole: "",
        workspaces: [],
      });
      resolve("User Data Stored Successfully");
    } catch (error) {
      reject(error);
    }
  });
};

export default StoreUserData;
