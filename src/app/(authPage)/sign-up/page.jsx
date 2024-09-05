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
} from "@firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  
  const SignUpWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
    .then((result) => {
      console.log("loggedin", result);
    })
    .catch((error) => {
      console.log(error);
    });
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


  
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  if (user) {
    router.push(`/CreateProfile?id=${user.uid}`);
  }
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
              <label className="font-bold" htmlFor="">
                Email
              </label>
              <input
                type="text"
                className="m-2 p-2 border-2 rounded-md outline-thm-clr-1"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold" htmlFor="">
                Password
              </label>
              <input
                type="text"
                className="m-2 p-2 border-2 rounded-md outline-thm-clr-1"
              />
            </div>
            <div className="AuthBtn flex justify-center items-center m-3">
              <button className="btn p-1">
                <span class="circle1"></span>
                <span class="circle2"></span>
                <span class="circle3"></span>
                <span class="circle4"></span>
                <span class="circle5"></span>
                <span class="text">Submit</span>
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
              <span class="m-1 font-bold text-lg">
                <span class="text-[#4285F4]">G</span>
                <span class="text-[#EA4335]">o</span>
                <span class="text-[#FBBC05]">o</span>
                <span class="text-[#4285F4]">g</span>
                <span class="text-[#34A853]">l</span>
                <span class="text-[#EA4335]">e</span>
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
        </div>
      </div>
    </>
  );
};

export default Page;
