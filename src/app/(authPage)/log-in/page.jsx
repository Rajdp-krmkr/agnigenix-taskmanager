"use client";

import React, { useEffect, useState } from "react";
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
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import DottedBg from "@/ui components/dottedBg/dottedBg";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleClick = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sendEmailVerification(auth.currentUser)
          .then(() => {
            console.log("email verification link sent");
          })
          .catch((error) => {
            console.log("Error in sending email verification link", error);
          });

        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error, errorCode, errorMessage);
      });
  };

  // const [user, setUser] = useState(null);

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setUser(user);
  //     } else {
  //       setUser(null);
  //     }
  //   });
  // }, []);

  // if (user) {
  //   if (user.emailVerified) {
  //     router.push(`/CreateProfile?id=${user.uid}`);
  //   } else {
  //     router.push("/verify-email");
  //   }
  // }
  
  return (
    <>
      <DottedBg />
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="lg:w-[350px] lg:h-[550px] bg-white rounded-lg flex flex-col justify-center p-4">
          <div className="text-4xl text-thm-clr-1 font-bold flex justify-center items-center m-4">
            <h1>Log in</h1>
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
              className="hover:underline text-thm-clr-1 text-xs text-end cursor-pointer"
              onClick={() => {}}
            >
              Forget password?
            </div>
            <div
              className="AuthBtn flex justify-center items-center m-3"
              onClick={() => {
                handleClick();
              }}
            >
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
              Log-in with
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
              <span>Log-in with</span>
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
