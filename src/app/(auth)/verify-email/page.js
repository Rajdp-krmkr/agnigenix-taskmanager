"use client";
import DottedBg from "@/components/dottedBg";
import TypeWriterLoader from "@/components/typewriterloader";
import { useUserContext } from "@/context/userContext";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged, sendEmailVerification } from "@firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();

  const {
    user,
    emailVerified,
    setEmailVerified,
    isProfileCreated,
    isLoading,
    setIsLoading,
  } = useUserContext();

  const [authStateUser, setAuthStateUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthStateUser(user);
      } else {
        setAuthStateUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleEmailVerification = async () => {
      if (authStateUser && !isLoading) {
        // If email is not verified, send verification email
        if (!authStateUser.emailVerified) {
          try {
            await sendEmailVerification(authStateUser);
            console.log("Verification email sent");
          } catch (error) {
            console.error("Error sending verification email:", error);
          }
        } else {
          // Email is verified, update database and redirect
          try {
            if (user && user.uid) {
              // Find user document by uid and update emailVerified
              const docCollectionRef = collection(db, "users");
              const q = query(docCollectionRef, where("uid", "==", user.uid));
              const docSnap = await getDocs(q);

              if (!docSnap.empty) {
                const userDocRef = doc(db, "users", docSnap.docs[0].id);
                await updateDoc(userDocRef, {
                  emailVerified: true,
                });
                setEmailVerified(true);
              }
            }

            // Redirect based on profile completion status
            setTimeout(() => {
              if (!isProfileCreated) {
                router.push(
                  `/CreateProfile?id=${user?.uid || authStateUser.uid}`
                );
              } else {
                router.push(`/Dashboard`);
              }
            }, 2000);
          } catch (error) {
            console.error("Error updating email verification status:", error);
          }
        }
      }
    };

    handleEmailVerification();
  }, [
    authStateUser,
    isLoading,
    user,
    isProfileCreated,
    setEmailVerified,
    router,
  ]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <TypeWriterLoader />
      </div>
    );
  }

  return (
    <>
      <DottedBg />
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        {emailVerified || authStateUser?.emailVerified ? (
          <div className="text-center">
            <h1 className="font-bold text-xl text-green-500 mb-4">
              Your email is verified ✅
            </h1>
            <p className="text-gray-600">
              Redirecting you to complete your profile...
            </p>
          </div>
        ) : (
          <>
            <p className="font-bold text-lg m-5 text-center">
              A email verification link is sent to your email{" "}
              <span className="text-blue-500">
                {user?.email || authStateUser?.email}
              </span>
            </p>
            <p className="m-1 text-center">
              Please verify your email to proceed
            </p>
            <p className="text-red-500 font-semibold m-2 text-center">
              After verification, please reload the page
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-600 py-2 px-8 m-2 rounded-md text-white transition-colors"
              onClick={() => {
                window.location.reload();
              }}
            >
              Reload Page
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Page;
