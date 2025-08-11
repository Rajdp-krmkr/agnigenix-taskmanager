"use client";

import React, { useEffect, useState } from "react";
import DottedBg from "@/components/dottedBg";
import GithubLogo from "../../../../public/icons/github-mark.png";
import Image from "next/image";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "@firebase/firestore";
import { useUserContext } from "@/context/userContext";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user, isUserLoggedIn, isLoading, emailVerified, isProfileCreated } =
    useUserContext();

  const handleEmailLogin = async () => {
    try {
      setError("");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in successfully");

      // Navigation will be handled by useEffect below
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
    }
  };

  const SignInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google login successful", result);

      // Navigation will be handled by useEffect below
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message);
    }
  };

  const SignInWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Github login successful", result);

      // Navigation will be handled by useEffect below
    } catch (error) {
      console.error("Github login error:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (!isLoading && isUserLoggedIn) {
      if (isProfileCreated) {
        router.push("/Dashboard");
      } else if (emailVerified) {
        router.push(`/CreateProfile?id=${user.uid}`);
      } else {
        router.push("/verify-email");
      }
    }
  }, [
    isLoading,
    isUserLoggedIn,
    isProfileCreated,
    emailVerified,
    user,
    router,
  ]);

  return (
    <>
      <DottedBg />
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="lg:w-[350px] lg:h-[550px] bg-white rounded-lg flex flex-col justify-center p-4">
          <div className="text-4xl text-thm-clr-1 font-bold flex justify-center items-center m-4">
            <h1>Log In</h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="input my-2">
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="m-2 p-2 border-2 rounded-md outline-thm-clr-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="m-2 p-2 border-2 rounded-md outline-thm-clr-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div
              className="AuthBtn flex justify-center items-center m-3"
              onClick={handleEmailLogin}
            >
              <button className="btn p-1">
                <span className="circle1"></span>
                <span className="circle2"></span>
                <span className="circle3"></span>
                <span className="circle4"></span>
                <span className="circle5"></span>
                <span className="text">Log In</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center flex-row gap-2 m-2">
            <div className="line h-[1px] w-[50%] bg-gray-200"></div>
            <div className=" text-gray-500">or</div>
            <div className="line h-[1px] w-[50%] bg-gray-200"></div>
          </div>

          <div className="authwithProviders flex flex-col justify-center gap-5 my-4 m-2">
            <button
              className="p-3 rounded-md border-2 hover:border-thm-clr-2 transition-all font-semibold"
              onClick={SignInWithGoogle}
            >
              Log in with
              <span className="m-1 font-bold text-lg">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
            </button>
            <button
              className="p-3 rounded-md border-2 hover:border-thm-clr-2 transition-all flex font-semibold justify-center items-center gap-2"
              onClick={SignInWithGithub}
            >
              <span>Log in with</span>
              <div className="relative w-6 h-6 flex justify-center items-center">
                <Image fill src={GithubLogo} alt="github-logo" />
              </div>
            </button>
          </div>

          <div className="text-center mt-4">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <Link href="/sign-up" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
