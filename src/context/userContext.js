"use client";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "@firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "@firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // const docRef = doc(db, "users", user.uid);
        // const docSnap = await getDoc(docRef);

        const docCollectionRef = collection(db, "users");
        const q = query(docCollectionRef, where("uid", "==", user.uid));
        const docSnap = await getDocs(q);

        console.log("User data:", docSnap.docs[0].data());

        if (!docSnap.empty) {
          setUser(docSnap.docs[0].data());
        }
        setIsUserLoggedIn(true);
      } else {
        setUser(null);
        setIsUserLoggedIn(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isUserLoggedIn,
        setIsUserLoggedIn,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
export const useUserContext = () => useContext(UserContext);
