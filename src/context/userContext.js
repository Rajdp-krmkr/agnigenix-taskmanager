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
  const [emailVerified, setEmailVerified] = useState(false);
  const [isProfileCreated, setIsProfileCreated] = useState(false);

  const fetchUser = () => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // all the users are stores based on username as id
        // so fetching the users by searching queries
        const docCollectionRef = collection(db, "users");
        const q = query(docCollectionRef, where("uid", "==", user.uid));
        const docSnap = await getDocs(q);

        // console.log("User data:", docSnap.docs[0].data());

        if (!docSnap.empty && docSnap.docs.length > 0) {
          const userData = docSnap.docs[0].data();
          setUser(userData);
          setEmailVerified(userData.emailVerified);
          setIsProfileCreated(userData?.username != null);
        } 
        setIsUserLoggedIn(true);
      } else {
        setUser(null);
        setIsUserLoggedIn(false);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    const unsubscribe = fetchUser();
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
        fetchUser,
        emailVerified,
        setEmailVerified,
        isProfileCreated,
        setIsProfileCreated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
export const useUserContext = () => useContext(UserContext);
