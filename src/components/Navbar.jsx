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

import { TbCalendarDue } from "react-icons/tb";
import { BsClipboardCheck } from "react-icons/bs";
import { BsClipboard2Check } from "react-icons/bs";
import { BiTaskX } from "react-icons/bi";
import { GoTasklist } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";
import { IoMdNotificationsOutline } from "react-icons/io";

import isUserAuthenticated from "@/Firebase Functions/isUserAuthenticated";
import CreateWorkSpacePopup from "./CreateWorkSpacePopup";
import ThemeToggle from "./ThemeToggle";

const NavbarComponent = () => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [User, setUser] = useState(null);
  const [uid, setUid] = useState(null);

  const [ClassNameForWorkSpace, setClassNameForWorkSpace] = useState("hidden");
  const [classNameForYourTasks, setClassNameForYourTasks] = useState("hidden");
  const [openTasksSection, setOpenTasksSection] = useState(false);
  const [openWorkSpaceSection, setOpenWorkSpaceSection] = useState(false);
  const [username, setUsername] = useState(null);
  const [CreateWorkspacePopupNum, setCreateWorkspacePopupNum] = useState(0);
  const [workspaceArray, setWorkspaceArray] = useState([]);
  const [email, setEmail] = useState(null);

  const Pathname = usePathname();
  useEffect(() => {
    const url = Pathname;
    setUrl(url);
    console.log(url);
  }, [Pathname]);

  const params = useParams();
  const uname = params.user;

  useEffect(() => {
    if (uname !== undefined) setUsername(uname);
  }, [uname]);

  useEffect(() => {
    console.log(username);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // console.log("User is signed in", user.uid);
        // console.log(user, "User");
        setUid(user.uid);
      } else {
        // console.log("User is signed out");
        // console.log(user, "User");
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
    if (uid !== null && username !== null) {
      isUserAuthenticated({ username, uid })
        .then((res) => {
          // console.log("User is authenticated", res);
          if (
            url === "/log-in" ||
            url === "/sign-up" ||
            url === "/CreateProfile" ||
            url === "/"
          ) {
            return;
          } else {
            // console.log(username);
            if (
              username !== null &&
              username !== "" &&
              username !== undefined
            ) {
              GetUserDataByUsername({ username })
                .then((result) => {
                  setUser(result);
                  console.log("adding workspace...");
                  setWorkspaceArray(result.workspaces);
                  setEmail(result.email);
                  console.log(result);
                  console.log(result.workspaces);
                  // console.log(res);
                })
                .catch((error) => {
                  // console.log(error);
                });
            }
          }
        })
        .catch((err) => {
          if (err == false) {
            router.push("/sign-up");
          }
        });
    }
  }, [uid, username]);
  // console.log(username);

  const searchparams = useSearchParams();
  const id = searchparams.get("id");
  useEffect(() => {
    setUid(id);
  }, [id]);

  useEffect(() => {
    // console.log(url);
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
    // console.log("CreateWorkspacePopupNum", CreateWorkspacePopupNum);
  }, [CreateWorkspacePopupNum]);

  if (
    url !== "/log-in" &&
    url !== "/sign-up" &&
    url !== "/CreateProfile" &&
    url !== "/" &&
    url !== "/verify-email"
  ) {
    return (
      <>
        <nav className="fixed top-0 left-0 p-2 dark:bg-gray-800 bg-gray-100 flex flex-col min-h-screen lg:w-[240px]">
          <div className="flex justify-between gap-5 items-center my-4 mx-auto">
            <h1 className="text-xl font-bold text-black dark:text-slate-200">
              Task Manager
            </h1>
            <ThemeToggle />

          </div>
          <div>
            <div
              className="bg-white dark:bg-gray-600 cursor-pointer hover:shadow-md transition-all shadow-sm flex flex-row items-center gap-2 p-2 rounded-lg m-2"
              onClick={() => {
                router.push(`/Profile/${username}`);
              }}
            >
              {User == null ? (
                // <div className="flex justify-center items-center w-full">
                <div class="loader w-9 h-9 border-[4px] border-white"></div>
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
                    <h2 className="text-[12px] font-semibold">
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
          <div className="flex flex-col min-h-[80vh] mt-0 gap-10 justify-between">
            <div className="mt-1">
              <ul>
                {[
                  {
                    name: "Dashboard",
                    icon: <MdOutlineDashboard />,
                    url: `/Dashboard/${username}`,
                    activatedIcon: <MdDashboard />,
                  },
                  {
                    name: "Notifications",
                    icon: <IoMdNotificationsOutline />,
                    url: `/Notifications/all/${username}`,
                    activatedIcon: <IoMdNotificationsOutline />,
                  },
                  {
                    name: "Your tasks",
                    icon: <FaTasks />,
                    url: `#`,
                    activatedIcon: "",
                    subSections: [
                      {
                        title: "Due tasks",
                        url: `/DueTasks/${username}`,
                        icon: <TbCalendarDue />,
                      },
                      {
                        title: "Completed tasks",
                        url: `/CompletedTasks/${username}`,
                        icon: <BsClipboardCheck />,
                      },
                      {
                        title: "Uncompleted tasks",
                        url: `/UncompletedTasks/${username}`,
                        icon: <BiTaskX />,
                      },
                      {
                        title: "All tasks",
                        url: `/AllTasks/${username}`,
                        icon: <GoTasklist />,
                      },
                      {
                        title: "Add new task",
                        url: `#`,
                        icon: <IoMdAdd />,
                      },
                    ],
                  },

                  {
                    name: "Workspace",
                    icon: <MdOutlineWorkOutline />,
                    url: `#`,
                    activatedIcon: <MdOutlineWork />,
                    subSections: workspaceArray,
                    // subSections: User.workspace,
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
                    className={``}
                  >
                    <div
                      className={`${
                        url === item.url
                          ? "text-thm-clr-1 dark:text-blue-500"
                          : "text-black dark:text-slate-200"
                      } ${
                        item.name === "Your tasks" && openTasksSection
                          ? "bg-gray-200 dark:bg-gray-700"
                          : item.name === "Workspace" && openWorkSpaceSection
                          ? "bg-gray-200 dark:bg-gray-700"
                          : ""
                      } flex flex-row gap-2 justify-between items-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer m-2 p-2 rounded-md`}
                      onClick={() => {
                        if (item.name === "Your tasks") {
                          setOpenTasksSection(!openTasksSection);
                          // console.log(openTasksSection);
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
                    </div>
                    <div className={`ml-6 m-2`}>
                      {item.name === "Your tasks" && openTasksSection ? (
                        <div className={`transition-all`}>
                          {item.subSections.map((section, index) => (
                            <div
                              key={index}
                              className={`
                                ${
                                  url === section.url
                                    ? "text-thm-clr-1 dark:text-blue-500"
                                    : "text-black dark:text-slate-200"
                                }
                                ${
                                  section.title === "Add new task"
                                    ? "bg-thm-clr-1 text-white transition-all dark:hover:text-black hover:bg-thm-clr-2"
                                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                                }
                                cursor-pointer my-1 rounded-md flex flex-row items-center gap-2 p-2 font-semibold text-xs`}
                              onClick={() => {
                                router.push(section.url);
                              }}
                            >
                              <div className="icon text-lg font-bold">
                                {section.icon}
                              </div>
                              <span>{section.title}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        item.name === "Workspace" &&
                        openWorkSpaceSection && (
                          <div className="flex flex-col">
                            <div className="workspaceScrollBar max-h-[268px] overflow-auto">
                              {item.subSections.length === 0 ? (
                                <span className="text-gray-400 text-xs">
                                  No workspace found
                                </span>
                              ) : (
                                item.subSections.map((subSection, index) => (
                                  <div
                                    key={index}
                                    className={`
                                    ${
                                      url === subSection.url
                                        ? "text-thm-clr-1 dark:text-blue-500"
                                        : "text-black dark:text-slate-200"
                                    }
                                
                                    cursor-pointer transition-all  hover:bg-gray-200 dark:hover:bg-gray-700 my-1 rounded-md flex flex-row items-center justify-between gap-2 p-2 font-semibold text-xs`}
                                    onClick={() => {
                                      router.push(subSection.url);
                                    }}
                                  >
                                    <div className="icon flex gap-2 items-center font-bold">
                                      <span
                                        className={`${
                                          subSection.customizedLogo !== null &&
                                          subSection.customizedLogo.bg
                                        } ${
                                          subSection.customizedLogo !== null
                                            ? `text-${subSection.customizedLogo.text}`
                                            : "text-gray-400 border-2 border-gray-300"
                                        } cursor-pointer font-semibold text-center flex items-center justify-center text-xs rounded-lg w-6 h-6`}
                                      >
                                        <span>{subSection.LogoLetter}</span>
                                      </span>
                                      <span>{subSection.workspaceTitle}</span>
                                    </div>
                                    {subSection.isPrivate && (
                                      <div className=" flex fill-black dark:fill-slate-300 justify-center items-center">
                                        <svg
                                          className="lock-svgIcon w-3 h-3"
                                          viewBox="-0.5 -0.5 16 16"
                                        >
                                          <path
                                            d="M7.5 8.235c-0.1949375 0 -0.38187499999999996 0.0775 -0.5196875 0.2153125s-0.2153125 0.32475 -0.2153125 0.5196875v2.205c0 0.1949375 0.0775 0.38187499999999996 0.2153125 0.51975s0.32475 0.21525 0.5196875 0.21525c0.1949375 0 0.3819375 -0.07743749999999999 0.51975 -0.21525s0.21525 -0.32481250000000006 0.21525 -0.51975v-2.205c0 -0.1949375 -0.07743749999999999 -0.38187499999999996 -0.21525 -0.5196875s-0.32481250000000006 -0.2153125 -0.51975 -0.2153125Zm3.675 -2.94V3.825c0 -0.9746875 -0.3871875 -1.9094375 -1.076375 -2.598625S8.4746875 0.15 7.5 0.15c-0.9746875 0 -1.9094375 0.3871875 -2.598625 1.076375S3.825 2.8503125000000002 3.825 3.825v1.47c-0.5848125 0 -1.145625 0.23231249999999998 -1.5591875 0.6458125000000001C1.8523124999999998 6.354375 1.62 6.9152499999999995 1.62 7.5v5.145c0 0.58475 0.23231249999999998 1.145625 0.6458125000000001 1.5591875 0.41356249999999994 0.4135 0.974375 0.6458125000000001 1.5591875 0.6458125000000001h7.35c0.58475 0 1.145625 -0.23231249999999998 1.5591875 -0.6458125000000001 0.4135 -0.41356249999999994 0.6458125000000001 -0.9744375 0.6458125000000001 -1.5591875V7.5c0 -0.58475 -0.23231249999999998 -1.145625 -0.6458125000000001 -1.5591875 -0.41356249999999994 -0.4135 -0.9744375 -0.6458125000000001 -1.5591875 -0.6458125000000001ZM5.295 3.825c0 -0.5848125 0.23231249999999998 -1.145625 0.6458125000000001 -1.5591875C6.354375 1.8523124999999998 6.9152499999999995 1.62 7.5 1.62s1.145625 0.23231249999999998 1.5591875 0.6458125000000001c0.4135 0.41356249999999994 0.6458125000000001 0.974375 0.6458125000000001 1.5591875v1.47H5.295V3.825Zm6.615 8.82c0 0.1949375 -0.07743749999999999 0.3819375 -0.21525 0.51975s-0.32481250000000006 0.21525 -0.51975 0.21525H3.825c-0.1949375 0 -0.38187499999999996 -0.07743749999999999 -0.51975 -0.21525 -0.1378125 -0.1378125 -0.21525 -0.32481250000000006 -0.21525 -0.51975V7.5c0 -0.1949375 0.07743749999999999 -0.38187499999999996 0.21525 -0.5196875 0.137875 -0.1378125 0.32481250000000006 -0.2153125 0.51975 -0.2153125h7.35c0.1949375 0 0.3819375 0.0775 0.51975 0.2153125s0.21525 0.32475 0.21525 0.5196875v5.145Z"
                                            fill=""
                                            stroke-width="1"
                                          ></path>
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                            <button
                              className="bg-thm-clr-1 my-4 text-white transition-all hover:text-black hover:bg-thm-clr-2 cursor-pointer rounded-md flex flex-row items-center gap-2 p-2 font-semibold text-xs"
                              onClick={() => {
                                // router.push(`/CreateWorkspace/${username}`);
                                setCreateWorkspacePopupNum(
                                  CreateWorkspacePopupNum + 1
                                );
                              }}
                            >
                              <span className="">
                                <IoMdAdd />
                              </span>
                              <span>Add new workspace</span>
                            </button>
                          </div>
                        )
                      )}
                    </div>
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
                      item.name === "Log out"
                        ? "text-red-500 dark:text-red-500"
                        : "text-black"
                    } ${
                      url === item.url
                        ? "text-thm-clr-1 dark:text-blue-500"
                        : "text-black dark:text-slate-200"
                    } cursor-pointer m-2 flex flex-row gap-2 items-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all rounded-md p-2`}
                    onClick={() => {
                      if (item.name === "Log out") {
                        auth.signOut();
                        router.push("/");
                      } else {
                        router.push(item.url);
                      }
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
        <CreateWorkSpacePopup
          createPopupNum={CreateWorkspacePopupNum}
          uname={username}
          uniqID={uid}
          workspacearray={workspaceArray}
          email={email}
          name={User !== null ? User.name : ""}
        />
      </>
    );
  }
  return (
    <>
      <nav className="fixed w-screen top-0">
        <div className=" flex flex-row justify-center m-3 items-center ">
          <ul className="flex flex-row items-center justify-between w-[70%]">
            <li className="">
              <h1 className="text-2xl font-bold">Task Manager</h1>
            </li>
            <li className="">
              {url === "/CreateProfile" ||
              url === "/log-in" ||
              url === "/sign-up"
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
    </>
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
