import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, query, where, limit } from "@firebase/firestore";

const realTimeUserSearch = (searchQuery = "", options = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docs = collection(db, "users");
      let q = docs;
      
      // If search query is provided and long enough, try to optimize with server-side filtering
      if (searchQuery && searchQuery.length >= 2) {
        const { limit: resultLimit = 50 } = options;
        
        // Create query with basic filtering (you may need to adjust based on your Firestore setup)
        q = query(
          docs,
          // Note: Firestore text search is limited. For better performance, consider:
          // 1. Using Algolia for full-text search
          // 2. Creating separate fields for search optimization
          // 3. Using Firebase Extensions for search
          limit(resultLimit)
        );
      }

      const querySnapshot = await getDocs(q);

      let usersList = querySnapshot.docs.map((doc) => ({
        username: doc.data().username,
        name: doc.data().name,
        email: doc.data().email,
        photoURL: doc.data().photoURL,
        uid: doc.data().uid,
      }));

      // Client-side filtering if search query is provided
      if (searchQuery && searchQuery.length >= 2) {
        const upperCasedQuery = searchQuery.toUpperCase();
        usersList = usersList.filter(user => {
          const upperCasedUsername = user.username.toUpperCase();
          const upperCasedName = user.name.toUpperCase();
          return upperCasedUsername.includes(upperCasedQuery) || 
                 upperCasedName.includes(upperCasedQuery);
        });
      }

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
