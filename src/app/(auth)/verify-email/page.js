"use client";
import DottedBg from "@/components/dottedBg";
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
    const sendVerificationEmail = async () => {
      if (user && !isLoading && authStateUser) {
        if (!authStateUser.emailVerified)
          await sendEmailVerification(authStateUser)
            .then(() => {
              console.log("Verification email sent");
            })
            .catch((error) => {
              console.error("Error sending verification email:", error);
            });
        else {
          if (!emailVerified) {
            const docCollectionRef = collection(db, "users");
            const q = query(docCollectionRef, where("uid", "==", user.uid));
            const docSnap = await getDocs(q);
            const data = docSnap.docs[0].data();
            // await updateDoc(docSnap.docs[0].ref, {
            //   emailVerified: true,
            // });
            await updateDoc(doc(db, "users", data.username), {
              emailVerified: true,
            });
          }

          if (!isProfileCreated) {
            setTimeout(() => {
              router.push(`/CreateProfile?id=${user.uid}`);
            }, 3000);
          } else {
            setTimeout(() => {
              router.push(`/Dashboard`);
            }, 3000);
          }
        }
      }
    };
    sendVerificationEmail();
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center">
        <div className="typewriter absolute top-[40vh] self-center">
          <div className="slide">
            <i></i>
          </div>
          <div className="paper"></div>
          <div className="keyboard"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DottedBg />
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        {emailVerified || authStateUser?.emailVerified ? (
          <h1 className="font-bold text-xl text-green-500">
            Your email is verified ✅
          </h1>
        ) : (
          <>
            <p className="font-bold text-lg m-5">
              A email verification link is sent to your email{" "}
              <span className="text-blue-500">{user?.email}</span>
            </p>
            <p className="m-1">Please verify your email to proceed</p>
            <p className="text-red-500 font-semibold m-2">
              After verification, please reload the window
            </p>
            {/* <button
              className="bg-black py-2 px-8 m-2 rounded-md text-white "
              onClick={() => {
                router.refresh();
              }}
            >
              Reload
            </button> */}
          </>
        )}{" "}
      </div>
    </>
  );
};

export default Page;
