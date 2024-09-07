import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "@firebase/firestore";

const isUserAuthenticated = ({ username, uid }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check if username is valid
      if (!username) {
        console.error("Invalid username: Username is required.");
        return reject(false);
      }

      console.log("Checking username:", username);

      // Create a document reference in the "users" collection with the given username
      const docRef = doc(db, "users", username);

      // Get the document snapshot
      const docSnap = await getDoc(docRef);

      // Check if the document exists
      if (docSnap.exists()) {
        // Compare the uid from the document with the provided uid
        docSnap.data()?.uid === uid ? resolve(true) : reject(false);
        console.log("User authenticated successfully.");
      } else {
        // Document doesn't exist
        console.log("No such document!");
        reject(false);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      reject(false);
    }
  });
};

export default isUserAuthenticated;


export const CheckIfUserAssignedToWorkspace = () => {
  
  
}

