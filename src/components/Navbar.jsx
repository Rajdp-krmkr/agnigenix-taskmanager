"use client";
import GetUserData from "@/Firebase Functions/GetuserData";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "@firebase/auth";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const NavbarComponent = () => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [User, setUser] = useState(null);
  const [uid, setUid] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
    }
  });

  const Pathname = usePathname();
  useEffect(() => {
    const url = Pathname;
    setUrl(url);
  }, [Pathname]);

  const searchparams = useSearchParams();
  const id = searchparams.get("id");
  useEffect(() => {
    setUid(id);
  }, [id]);

  useEffect(() => {
    console.log(url);

    if (
      url === "/log-in" ||
      url === "/sign-up" ||
      url === "/CreateProfile" ||
      url === "/"
    ) {
      return;
    } else {
      if (sessionStorage.getItem("user")) {
        setUser(JSON.parse(sessionStorage.getItem("user")));
        console.log("object");
      } else if (uid !== null) {
        console.log("object");
        GetUserData({ uid })
          .then((res) => {
            setUser(res);
            sessionStorage.setItem("user", JSON.stringify(res));
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [url]);

  if (
    url !== "/log-in" &&
    url !== "/sign-up" &&
    url !== "/CreateProfile" &&
    url !== "/"
  ) {
    return (
      <>
        <nav className="fixed top-0 left-0 bg-gray-100 min-h-screen lg:w-[200px]">

        </nav>
      </>
    );
  }
  return (
    <nav className="fixed w-screen top-0">
      <div className=" flex flex-row justify-center m-3 items-center ">
        <ul className="flex flex-row items-center justify-between w-[70%]">
          <li className="">
            <h1 className="text-2xl font-bold">Task Manager</h1>
          </li>
          <li className="">
            {url === "/CreateProfile" || url === "/log-in" || url === "/sign-up"
              ? null
              : url === "/" && (
                  <>
                    <div className="flex justify-evenly gap-7">
                      <button
                        className="p-1 px-5 rounded-md hover:bg-transparent font-semibold border-2 border-thm-clr-1 transition-all hover:text-black text-white bg-thm-clr-1"
                        onClick={() => {
                          router.push("/sign-up");
                        }}
                      >
                        <span>Sign up</span>
                      </button>

                      <button
                        className="p-1 px-5 rounded-md hover:bg-transparent font-semibold border-2 border-thm-clr-2 transition-all hover:text-black text-black bg-thm-clr-2"
                        onClick={() => {
                          router.push("/log-in");
                        }}
                      >
                        <span>Sign in</span>
                      </button>
                    </div>
                  </>
                )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

const Navbar = () => {
  return (
    <>
      <Suspense>
        <NavbarComponent />
      </Suspense>
    </>
  );
};

export default Navbar;
