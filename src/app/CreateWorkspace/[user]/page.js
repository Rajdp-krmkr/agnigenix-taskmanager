"use client";
import { GetUserDataByUsername } from "@/Firebase Functions/GetuserData";
import isUserAuthenticated from "@/Firebase Functions/isUserAuthenticated";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "@firebase/auth";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const [uid, setUid] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [url, setUrl] = React.useState(null);

  const Pathname = usePathname();
  useEffect(() => {
    const url = Pathname;
    setUrl(url);
    console.log(url);
  }, [Pathname]);

  const params = useParams();
  const username = params.user;
  useEffect(() => {
    console.log(username);

    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user, "User is signed in");
        setUid(user.uid);
      } else {
        console.log(user, "User is signed out");
        if (
          url !== "/log-in" &&
          url !== "/sign-up" &&
          url !== "/CreateProfile" &&
          url !== ""
        ) {
          router.push("/sign-up");
        }
      }
    });
  }, []);

  useEffect(() => {
    if (uid !== null && username) {
      isUserAuthenticated({ username, uid })
        .then((res) => {
          if (username !== null && username !== "" && username !== undefined) {
            // console.log(username);
          }
          //   console.log("User is authenticated", res);
          //   if (
          //     url === "/log-in" ||
          //     url === "/sign-up" ||
          //     url === "/CreateProfile" ||
          //     url === "/"
          //   ) {
          //     return;
          //   } else {
          //     console.log(username);
          //     if (
          //       username !== null &&
          //       username !== "" &&
          //       username !== undefined
          //     ) {
          //     //   GetUserDataByUsername({ username })
          //     //     .then((res) => {
          //     //       setUser(res);
          //     //       console.log(res);
          //     //     })
          //     //     .catch((error) => {
          //     //       console.log(error);
          //     //     });
          //     }
        })
        .catch((err) => {
          if (err == false) {
            router.push("/sign-up");
          }
        });
    }
  }, [uid]);

  return (
    <>
      <div className="mt-7 lg:ml-[210px] lg:mr-[180px] m-10 flex justify-center items-center">
        <div className="m-2 w-full">
          <h1
            className="text-2xl font-bold mx-12 cursor-pointer"
            onClick={() => {
              router.push(`/CreateWorkspace/${username}`);
            }}
          >
            Create Workspace
          </h1>
          <p className="text-gray-400 text-xs mx-12">
            Create a workspace for your team to collaborate and work together
          </p>
          <div className="m-2 mx-20">
              <div className="flex flex-col">
                  <label htmlFor="">Workspace name</label>
                  <input type="text" className="border-2 border-gray-300" />
              </div>
              <div className="flex flex-col">
                  <label htmlFor="">Workspace description</label>
                  <textarea type="text" className="border-2 border-gray-300" />

              </div>    
              <div>
                
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
