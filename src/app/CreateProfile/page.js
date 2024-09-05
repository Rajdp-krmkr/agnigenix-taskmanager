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

  const [shouldWait, setShouldWait] = useState(false);

  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState(null);
  const [photoURL, setphotoURL] = useState(null);

  const [IsUsernameExist, setIsUsernameExist] = useState(null);
  const [usernameMessage, setUsernameMessage] = useState(null);

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

  function validateUsername(username) {
    // Check for minimum and maximum length
    if (username.length < 3 || username.length > 15) {
      setUsernameMessage("Username must be between 3 and 15 characters.");
      setIsUsernameExist(true);
      return false;
    }

    // Check if the username starts with an underscore
    if (username.startsWith("_")) {
      setUsernameMessage("Username cannot start with an (_).");
      setIsUsernameExist(true);
      return false;
    }
    if (username.startsWith("-")) {
      setUsernameMessage("Username cannot start with an (-).");
      setIsUsernameExist(true);
      return false;
    }

    // Regular expression for the username rules:
    // - Alphanumeric characters (a-z, A-Z, 0-9)
    // - Underscore (_) and hyphen (-) are allowed
    // - No spaces allowed
    const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/;

    // Check if the username matches the regex
    if (!usernameRegex.test(username)) {
      setUsernameMessage(
        "Username can only contain letters, numbers, underscores (_), and hyphens (-)."
      );
      setIsUsernameExist(true); //! here setIsUsernameExist is working as a boundery for the username
      return false;
    }

    // If all checks pass
    setUsernameMessage("Username is valid.");
    setIsUsernameExist(false);
    return true;
  }

  // Example usage
  // const usernamesToTest = [
  //   "john_doe",    // valid
  //   "john-doe",    // valid
  //   "johndoe123",  // valid
  //   "admin@site",  // invalid (special characters like @ not allowed)
  //   "john doe",    // invalid (spaces not allowed)
  //   "jo",          // invalid (too short)
  //   "thisusernameiswaytoolong", // invalid (too long)
  //   "_johndoe",    // invalid (cannot start with underscore)
  //   "johndoe-",    // valid
  //   "john__doe",   // valid
  //   "john--doe"    // valid
  // ];

  const debouncedUsername = useDebounce(username, 500);
  useEffect(() => {
    console.log("debouncedUsername: ", debouncedUsername);

    if (debouncedUsername !== null && validateUsername(debouncedUsername)) {
      console.log(debouncedUsername);
      CheckUserName(debouncedUsername)
        .then((res) => {
          console.log("res: ", res);
          setIsUsernameExist(res);
          setUsernameMessage("Username already exist");
          console.log("username exist, please choose another one");
        })
        .catch((error) => {
          console.log("res: ", error);
          setIsUsernameExist(error);
          setUsernameMessage("Username is available");
          console.log("username is available");
        });
    }
  }, [debouncedUsername]);

  const handleClick = () => {
    if (name === "" || username === "") {
      alert("Please fill in all fields");
    } else {
      if (IsUsernameExist === false) {
        setShouldWait(true);
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
                src={photoURL !== null ? photoURL : ""}
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
                {IsUsernameExist === null ? "" : usernameMessage}
              </span>
            </div>
            <div className="AuthBtn flex justify-center items-center m-3">
              {shouldWait ? (
                <div class="typewriter m-5">
                  <div class="slide">
                    <i></i>
                  </div>
                  <div class="paper"></div>
                  <div class="keyboard"></div>
                </div>
              ) : (
                <button
                  className="btn p-1"
                  onClick={() => {
                    if (!shouldWait) {
                      handleClick();
                    }
                  }}
                >
                  <span class="circle1"></span>
                  <span class="circle2"></span>
                  <span class="circle3"></span>
                  <span class="circle4"></span>
                  <span class="circle5"></span>

                  <span class="text">Create profile</span>
                </button>
              )}
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
