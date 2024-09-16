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
                        url === item.url ? "text-thm-clr-1" : "text-black"
                      } ${
                        item.name === "Your tasks" && openTasksSection
                          ? "bg-gray-200"
                          : item.name === "Workspace" && openWorkSpaceSection
                          ? "bg-gray-200"
                          : ""
                      } flex flex-row gap-2 justify-between items-center hover:bg-gray-200 transition-all cursor-pointer m-2 p-2 rounded-md`}
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
                                    ? "text-thm-clr-1"
                                    : "text-black"
                                }
                                ${
                                  section.title === "Add new task"
                                    ? "bg-thm-clr-1 text-white transition-all hover:text-black hover:bg-thm-clr-2"
                                    : "hover:bg-gray-200"
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
                                    ? "text-thm-clr-1"
                                    : "text-black"
                                }
                                
                                cursor-pointer transition-all hover:bg-gray-200 my-1 rounded-md flex flex-row items-center gap-2 p-2 font-semibold text-xs`}
                                    onClick={() => {
                                      router.push(subSection.url);
                                    }}
                                  >
                                    <div className="icon font-bold">
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
                                    </div>
                                    <span>{subSection.workspaceTitle}</span>
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
                      item.name === "Log out" ? "text-red-500" : "text-black"
                    } ${
                      url === item.url ? "text-thm-clr-1" : "text-black"
                    } cursor-pointer m-2 flex flex-row gap-2 items-center hover:bg-gray-200 transition-all rounded-md p-2`}
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
