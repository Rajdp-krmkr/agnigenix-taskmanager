"use client";

import React, { useEffect, useState } from "react";
import DottedBg from "@/components/dottedBg";
import GithubLogo from "../../../../public/icons/github-mark.png";
import Image from "next/image";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "@firebase/auth";
import { auth, db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { useUserContext } from "@/context/userContext";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const SignUpWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("loggedin", result);

      // Check if user document already exists
      const userDocRef = doc(db, "users", result.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // Create user document if it doesn't exist
        await setDoc(userDocRef, {
          bio: "",
          email: result.user.email,
          jobRole: "",
          name: result.user.displayName,
          photoURL: result.user.photoURL,
          socialMediaAcounts: [],
          uid: result.user.uid,
          username: null,
          workspaces: [],
          emailVerified: true, // Google accounts are pre-verified
          userCreatedAt: new Date(),
        });

        // Redirect to create profile for new users
        router.push(`/CreateProfile?id=${result.user.uid}`);
      } else {
        // Check if profile is complete
        const userData = userDocSnap.data();
        if (userData.username == null) {
          router.push(`/CreateProfile?id=${result.user.uid}`);
        } else {
          router.push(`/Dashboard/`);
        }
      }
    } catch (error) {
      console.error("Google signup error:", error);
    }
  };

  const SignUpWithGithub = () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("loggedin", result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClickEmailSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        bio: "",
        email: user.email,
        jobRole: "",
        name: user.displayName || "",
        photoURL:
          user.photoURL ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        socialMediaAcounts: [],
        uid: user.uid,
        username: null,
        workspaces: [],
        emailVerified: false,
        userCreatedAt: new Date(),
      });

      // Send verification email
      await sendEmailVerification(user);
      console.log("Email verification link sent");

      // Redirect to verify-email page
      router.push("/verify-email");
    } catch (error) {
      console.error("Error in signup:", error);
      // You might want to show an error message to the user here
    }
  };

  useEffect(() => {
    if (!isLoading && isUserLoggedIn) {
      if (isProfileCreated) {
        router.replace(`/Dashboard/`);
      } else if (emailVerified) {
        router.replace(`/CreateProfile?id=${user.uid}`);
      } else if (user && !emailVerified) {
        router.replace("/verify-email");
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
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="lg:w-[350px] lg:h-[550px] bg-white rounded-lg flex flex-col justify-center p-4">
          <div className="text-4xl text-thm-clr-1 font-bold flex justify-center items-center m-4">
            <h1>Sign Up</h1>
          </div>
          <div className="input my-2">
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="email">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="m-2 p-2 border-2 rounded-md outline-thm-clr-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="">
                Password
              </label>
              <input
                type="password"
                className="m-2 p-2 border-2 rounded-md outline-thm-clr-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div
              className="AuthBtn flex justify-center items-center m-3"
              onClick={() => {
                handleClickEmailSignup();
              }}
            >
              <button className="btn p-1">
                <span className="circle1"></span>
                <span className="circle2"></span>
                <span className="circle3"></span>
                <span className="circle4"></span>
                <span className="circle5"></span>
                <span className="text">Submit</span>
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
              onClick={() => {
                SignUpWithGoogle();
              }}
            >
              Sign-up with
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
              onClick={() => {
                SignUpWithGithub();
              }}
            >
              <span>Sign-up with</span>
              <div className="relative w-6 h-6 flex justify-center items-center">
                <Image fill src={GithubLogo} alt="github-logo" />
              </div>
            </button>
          </div>

          <div className="text-center mt-4">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/log-in" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
