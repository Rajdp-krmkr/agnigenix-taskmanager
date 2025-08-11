"use client";
import DottedBg from "@/components/dottedBg";
import UserContextProvider, { useUserContext } from "@/context/userContext";
import IsUserExist from "@/Firebase Functions/IsUserExist";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "@firebase/auth";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const {
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
  } = useUserContext();

  useEffect(() => {
    if (!isLoading) {
      if (isProfileCreated) {
        router.replace(`/Dashboard/`);
        console.log("Null user: ", user);
      } else if (emailVerified) {
        router.replace(`/CreateProfile?id=${user.uid}`);
      } else if (isUserLoggedIn) {
        //user authenticated but doc not created
        router.push("/sign-up");
      }
    }
  }, [
    isLoading,
    user,
    isUserLoggedIn,
    router,
    isProfileCreated,
    emailVerified,
  ]);

  return (
    <>
      <DottedBg />
      <div className=" w-screen h-screen flex justify-center items-center bg-transparent">
        <div className="flex flex-col justify-center items-center w-[50%] text-center gap-10">
          <h1 className="font-bold text-5xl m-5 my-0">
            Empower Your Productivity with Agnigenix Task Manager
          </h1>
          <p className="m-4 text-gray-500">
            Welcome to the Agnigenix Task Manager—your go-to tool for
            streamlined productivity. Simplify your workflow, prioritize tasks,
            and collaborate effortlessly. Achieve more with less effort and stay
            on top of your goals with Agnigenix
          </p>
          <div className=" flex justify-between w-[40%]">
            <button
              className="text-lg p-2 px-6 rounded-md hover:bg-white font-semibold border-2 border-thm-clr-1 transition-all hover:text-black text-white bg-thm-clr-1"
              onClick={() => {
                router.push("/sign-up");
              }}
            >
              <span>Sign up</span>
            </button>

            <button
              className="text-lg p-2 px-6 rounded-md hover:bg-white font-semibold border-2 border-thm-clr-2 transition-all hover:text-black text-black bg-thm-clr-2"
              onClick={() => {
                router.push("/log-in");
              }}
            >
              <span>Sign in</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
