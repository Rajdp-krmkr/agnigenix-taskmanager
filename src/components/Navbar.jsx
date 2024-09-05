"use client";
import GetUserData, {
  GetUserDataByUsername,
} from "@/Firebase Functions/GetuserData";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "@firebase/auth";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

import { MdOutlineDashboard, MdDashboard } from "react-icons/md";
import { GrTask } from "react-icons/gr";
import { MdOutlineWorkOutline } from "react-icons/md";
import { MdOutlineWork } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { IoMdArrowDropright } from "react-icons/io";
import { Chela_One } from "next/font/google";

const NavbarComponent = () => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [User, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const [ClassNameForWorkSpace, setClassNameForWorkSpace] = useState("hidden");
  const [classNameForYourTasks, setClassNameForYourTasks] = useState("hidden");
  const [openTasksSection, setOpenTasksSection] = useState(false);
  const [openWorkSpaceSection, setOpenWorkSpaceSection] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // console.log(user);
    }
  });

  const Pathname = usePathname();
  useEffect(() => {
    const url = Pathname;
    setUrl(url);
    console.log(url);
  }, [Pathname]);

  const params = useParams();
  const username = params.user;
  // console.log(username);

  const searchparams = useSearchParams();
  const id = searchparams.get("id");
  useEffect(() => {
    setUid(id);
  }, [id]);

  useEffect(() => {
    // console.log(url);

    if (
      url === "/log-in" ||
      url === "/sign-up" ||
      url === "/CreateProfile" ||
      url === "/"
    ) {
      return;
    } else {
      // if (sessionStorage.getItem("user")) {
      //   setUser(JSON.parse(sessionStorage.getItem("user")));
      //   console.log(JSON.parse(sessionStorage.getItem("user")))
      //   console.log("object");
      // } else if (uid !== null) {
      //   console.log("object");
      //   GetUserData({ uid })
      //     .then((res) => {
      //       setUser(res);
      //       sessionStorage.setItem("user", JSON.stringify(res));
      //     })
      //     .catch((error) => {
      //       console.log(error);
      //     });
      // }
      if (uid !== null) {
        GetUserData({ uid })
          .then((res) => {
            setUser(res);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        console.log(username);
        if (username !== null && username !== "" && username !== undefined) {
          GetUserDataByUsername({ username })
            .then((res) => {
              setUser(res);
              console.log(res);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
  }, [url]);

  useEffect(() => {
    const yourtasks = window.document.getElementById("yourTasks");
    const workspace = window.document.getElementById("workspace");
    yourtasks.addEventListener("mouseover", () => {
      setClassNameForYourTasks("block");
    });
    yourtasks.addEventListener("mouseout", () => {
      setClassNameForYourTasks("hidden");
    });

    workspace.addEventListener("mouseover", () => {
      setClassNameForWorkSpace("block");
    });
    workspace.addEventListener("mouseout", () => {
      setClassNameForWorkSpace("hidden");
    });
  }, []);

  useEffect(() => {
    console.log(openTasksSection);
  }, [openTasksSection]);
  useEffect(() => {
    console.log(openWorkSpaceSection);
  }, [openWorkSpaceSection]);

  if (
    url !== "/log-in" &&
    url !== "/sign-up" &&
    url !== "/CreateProfile" &&
    url !== "/"
  ) {
    return (
      <>
        <nav className="fixed top-0 left-0 p-2 bg-gray-100 flex flex-col min-h-screen lg:w-[210px]">
          <div className="flex justify-center my-4 mx-auto">
            <h1 className="text-xl font-bold text-black">Task Manager</h1>
          </div>
          <div>
            <div
              className="bg-white cursor-pointer hover:shadow-md transition-all shadow-sm flex flex-row items-center gap-2 p-2 rounded-lg m-2"
              onClick={() => {
                router.push(`/Profile/${username}`);
              }}
            >
              {User == null ? (
                // <div className="flex justify-center items-center w-full">
                <div class="loader"></div>
              ) : (
                // </div>
                <>
                  <div className="profilePhoto relative w-10 h-10 ">
                    <Image
                      src={User !== null ? User.photoURL : ""}
                      className="rounded-2xl"
                      fill
                      alt="profile-picture"
                    />
                    {/* //TODO: account svg will be added */}
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-[12px] font-bold">
                      {User !== null ? User.name : "name"}
                    </h2>
                    {/* //TODO: loader component will be added*/}
                    <p className="text-xs text-gray-400">
                      {User !== null ? User.username : "username"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col min-h-[80vh] my-2 gap-10 justify-between">
            <div className="mt-5">
              <ul>
                {[
                  {
                    name: "Dashboard",
                    icon: <MdOutlineDashboard />,
                    url: `/Dashboard/${username}`,
                    activatedIcon: <MdDashboard />,
                  },
                  {
                    name: "Your tasks",
                    icon: <FaTasks />,
                    url: `#`,
                    activatedIcon: "",
                    subSections: [
                      "Due tasks",
                      "Completed tasks",
                      "incompleted tasks",
                      "All tasks",
                      "Add new task",
                    ],
                  },

                  {
                    name: "Workspace",
                    icon: <MdOutlineWorkOutline />,
                    url: `#`,
                    activatedIcon: <MdOutlineWork />,
                  },
                ].map((item, index) => (
                  <li
                    key={index}
                    id={`${
                      item.name === "Your tasks"
                        ? "yourTasks"
                        : item.name === "Workspace"
                        ? "workspace"
                        : ""
                    }`}
                    className={`${
                      url === item.url ? "text-thm-clr-1" : "text-black"
                    } ${
                      item.name === "Your tasks" && openTasksSection
                        ? "bg-gray-200"
                        : item.name === "Workspace" && openWorkSpaceSection
                        ? "bg-gray-200"
                        : ""
                    } cursor-pointer m-2 flex flex-row gap-2 justify-between items-center hover:bg-gray-200 transition-all rounded-md p-2`}
                    onClick={() => {
                      if (item.name === "Your tasks") {
                        setOpenTasksSection(!openTasksSection);
                        console.log(openTasksSection);
                      } else if (item.name === "Workspace") {
                        setOpenWorkSpaceSection(!openWorkSpaceSection);
                        setClassNameForWorkSpace("block");
                      } else {
                        router.push(item.url);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 flex-row">
                      <div>{item.icon}</div>
                      <h2 className="text-sm font-semibold">{item.name}</h2>
                    </div>
                    <div
                      className={` ${
                        item.name === "Your tasks"
                          ? openTasksSection
                            ? `block rotate-90`
                            : `${classNameForYourTasks}`
                          : item.name === "Workspace"
                          ? openWorkSpaceSection
                            ? `block rotate-90`
                            : `${ClassNameForWorkSpace}`
                          : ""
                      } transition-all`}
                    >
                      {(item.name === "Workspace" ||
                        item.name === "Your tasks") && <IoMdArrowDropright />}
                    </div>
                    {/* <div>
                      {item.name === "Your tasks" && openTasksSection ? (
                        <div>
                          {item.subSections.map((section, index) => (
                            <div
                              key={index}
                              className="cursor-pointer hover:bg-gray-200 rounded-md p-2"
                            >
                              {section}
                            </div>
                          ))}
                        </div>
                      ) : item.name === "Workspace" && openWorkSpaceSection ? (
                        <div>
                          {item.subSections.length === 0
                            ? "No workspace found"
                            : item.subSections.map((section, index) => (
                                <div
                                  key={index}
                                  className="cursor-pointer hover:bg-gray-200 rounded-md p-2"
                                >
                                  {section}
                                </div>
                              ))}
                        </div>
                      ) : (
                        ""
                      )}
                    </div> */}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ul>
                {[
                  {
                    name: "Settings",
                    icon: <MdOutlineSettings />,
                    url: `/Settings/${username}`,
                    activatedIcon: "",
                  },
                  {
                    name: "Log out",
                    icon: <MdLogout />,
                    url: "/",
                    activatedIcon: "",
                  },
                ].map((item, index) => (
                  <li
                    key={index}
                    className={`${
                      item.name === "Log out" ? "text-red-500" : "text-black"
                    } ${
                      url === item.url ? "text-thm-clr-1" : "text-black"
                    } cursor-pointer m-2 flex flex-row gap-2 items-center hover:bg-gray-200  transition-all rounded-md p-2`}
                    onClick={() => {
                      router.push(item.url);
                    }}
                  >
                    <div>{item.icon}</div>
                    <h2 className="text-sm font-semibold">{item.name}</h2>
                  </li>
                ))}
              </ul>
            </div>
          </div>
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
