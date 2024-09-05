"use client";
import DottedBg from "@/components/dottedBg";
import CheckUserName from "@/Firebase Functions/CheckUserName";
import GetUserData from "@/Firebase Functions/GetuserData";
import StoreUserData from "@/Firebase Functions/StoreUserData";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "@firebase/auth";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import useDebounce from "@/Firebase Functions/useDebounce";

const PageComponent = () => {
  const router = useRouter();
  const [User, setUser] = useState(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setphotoURL] = useState("");

  const [IsUsernameExist, setIsUsernameExist] = useState(null);

  const searchparams = useSearchParams();
  const id = searchparams.get("id");
  useEffect(() => {
    setUid(id);
  }, [id]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setName(user.displayName);
        setUid(user.uid);
        setEmail(user.email);
        setphotoURL(user.photoURL);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (uid !== "") {
      console.log(uid);
      try {
        GetUserData({ uid })
          .then((res) => {
            if (res && res.username) {
              router.push(`/Profile/${res.username}`);
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            // Handle the case where the user data is not found
          });
      } catch (error) {
        console.log("Problem in getting user data:", error);
      }
    }
  }, [uid]);

  const debouncedUsername = useDebounce(username, 500);
  useEffect(() => {
    if (username !== "") {
      console.log(debouncedUsername);
      CheckUserName(debouncedUsername)
        .then((res) => {
          console.log("res: ", res);
          setIsUsernameExist(res);
          console.log("username exist, please choose another one");
        })
        .catch((error) => {
          console.log("res: ", error);
          setIsUsernameExist(error);
        });
    }
  }, [debouncedUsername]);

  const handleClick = () => {
    if (name === "" || username === "") {
      alert("Please fill in all fields");
    } else {
      if (IsUsernameExist === false) {
        StoreUserData({ uid, name, username, photoURL, email })
          .then((res) => {
            console.log(res);
            router.push(`/Profile/${username}`);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };

  return (
    <>
      <DottedBg />
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="lg:w-[350px] lg:h-[550px] bg-white rounded-lg flex flex-col justify-center p-4">
          <div className="text-4xl text-thm-clr-1 font-bold flex justify-center items-center m-4">
            <h1>Create Profile</h1>
          </div>
          <div className=" flex justify-center items-center m-4">
            <div className="relative w-24 h-24">
              <Image
                fill
                src={User !== null ? User.photoURL : ""}
                className="rounded-3xl"
                alt="profile-photo"
              />
            </div>
          </div>
          <div className="input my-2">
            <div className="flex flex-col gap-1 m-2">
              <label className="font-bold" htmlFor="">
                Name
              </label>
              <input
                type="text"
                className="m-2 p-2 border-2 rounded-md outline-thm-clr-1 text-sm"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>
            <div className="flex flex-col gap-1 m-2 my-4 mb-1">
              <label className="font-bold" htmlFor="">
                Choose username
              </label>
              <input
                type="text"
                className="m-2 mb-0 p-2 border-2 rounded-md outline-thm-clr-1  text-sm"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                value={username}
              />
            </div>

            <div className="mb-4 flex justify-end mx-7">
              <span
                className={`${
                  IsUsernameExist ? "text-red-500" : "text-green-500"
                } text-xs `}
              >
                {IsUsernameExist === null
                  ? ""
                  : IsUsernameExist
                  ? "Username already exist"
                  : "Username is available"}
              </span>
            </div>
            <div className="AuthBtn flex justify-center items-center m-3">
              <button
                className="btn p-1"
                onClick={() => {
                  handleClick();
                }}
              >
                <span class="circle1"></span>
                <span class="circle2"></span>
                <span class="circle3"></span>
                <span class="circle4"></span>
                <span class="circle5"></span>
                <span class="text">Create profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Page = () => {
  return (
    <Suspense>
      <PageComponent />
    </Suspense>
  );
};

export default Page;
