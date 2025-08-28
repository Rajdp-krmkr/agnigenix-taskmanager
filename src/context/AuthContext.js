"use client";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "@firebase/auth";
import { collection, getDocs, query, where } from "@firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isProfileCreated, setIsProfileCreated] = useState(false);

  const fetchUser = () => {
    return onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          // Fetch user data from Firestore
          const docCollectionRef = collection(db, "users");
          const q = query(docCollectionRef, where("uid", "==", authUser.uid));
          const docSnap = await getDocs(q);

          if (!docSnap.empty && docSnap.docs.length > 0) {
            const userData = docSnap.docs[0].data();
            setUser(userData);

            // Check email verification status from both Auth and Firestore
            const isEmailVerified =
              authUser.emailVerified || userData.emailVerified;
            setEmailVerified(isEmailVerified);

            // Check if profile is created (has username)
            setIsProfileCreated(
              userData?.username != null && userData?.username !== ""
            );
          } else {
            // User authenticated but no document in Firestore
            setUser(null);
            setEmailVerified(false);
            setIsProfileCreated(false);
          }
          setIsUserLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
          setEmailVerified(false);
          setIsProfileCreated(false);
          setIsUserLoggedIn(false);
        }
      } else {
        setUser(null);
        setIsUserLoggedIn(false);
        setEmailVerified(false);
        setIsProfileCreated(false);
      }
      setIsLoading(false);
    });
  };

    const value = useMemo(
      () => ({
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
      }),
      [user, isLoading, emailVerified, isProfileCreated, isUserLoggedIn]
    );

  useEffect(() => {
    const unsubscribe = fetchUser();
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext);
