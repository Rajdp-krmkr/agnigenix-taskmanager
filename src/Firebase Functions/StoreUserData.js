import { auth, db } from "@/lib/firebaseConfig";
import { updateCurrentUser } from "@firebase/auth";
import { doc, setDoc, updateDoc } from "@firebase/firestore";

const StoreUserData = ({ uid, name, username, photoURL, email }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Storing UserData...");
      await setDoc(
        doc(db, "users", uid),
        {
          name: name,
          username: username,
          photoURL: photoURL,
          email: email,
          uid: uid,
          bio: "",
          socialMediaAcounts: [],
          jobRole: "",
          workspaces: [], //TODO: add welcome notification
        },
        { merge: true }
      );

      updateCurrentUser(auth, {
        displayName: name,
        photoURL: photoURL,
      })
        .then(() => {
          console.log("User data updated successfully");
        })
        .catch((error) => {
          console.error("Error updating user data:", error);
        });
      resolve("User Data Stored Successfully");
    } catch (error) {
      reject(error);
    }
  });
};

export default StoreUserData;
