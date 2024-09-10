"use client";
import DottedBg from "@/components/dottedBg";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "@firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const [User, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  // useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setEmail(user.email);
        console.log("user", user);
        setUid(user.uid);
      } else {
        setUser(null);
      }
    });
  // }, [router]);

  useEffect(() => {
    if (User) {
      if (User.emailVerified) {
        setTimeout(() => {
          router.push(`/CreateProfile?id=${uid}`);    //!not redirecting automatically
        }, 2000);
      }
    }
  }, [User]);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       setUser(user);
  //       setEmail(user.email);
  //       setUid(user.uid);
  //       await user.reload();
  //       console.log("user", user);

  //       // If the user is verified, navigate after 2 seconds
  //       if (user.emailVerified) {
  //         console.log("Email verified. Redirecting...");
  //         setTimeout(() => {
  //           router.push(`/CreateProfile?id=${user.uid}`);
  //         }, 2000); // 2-second delay
  //       }
  //     } else {
  //       setUser(null);
  //     }
  //   });

  //   // Cleanup the listener when the component unmounts
  //   return () => unsubscribe();
  // }, [auth, router]);

  // useEffect(() => {
  //   console.log(auth.currentUser);
  //   setEmail(auth.currentUser.email);
  //   setUid(auth.currentUser.uid);
  //   setUser(auth.currentUser);
  //   auth.currentUser.reload();
  //   if (auth.currentUser.emailVerified) {
  //     router.push(`/CreateProfile?id=${auth.currentUser?.uid}`);
  //   }
  // }, [auth, router]);

  return (
    <>
      <DottedBg />
      <div className="h-screen w-screen flex flex-col justify-center items-center">
        {User?.emailVerified ? (
          <>
            <h1 className="font-bold text-xl text-green-500">
              Your email is verified ✅
            </h1>
          </>
        ) : (
          <>
            <p className="font-bold text-lg m-5">
              A email verification link is sent to your email{" "}
              <span className="text-blue-500">{email}</span>
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
