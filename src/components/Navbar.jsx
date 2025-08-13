"use client";
import { auth } from "@/lib/firebaseConfig";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

import { MdOutlineDashboard, MdDashboard } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { MdOutlineWorkOutline, MdOutlineWork } from "react-icons/md";
import { MdOutlineSettings, MdLogout } from "react-icons/md";
import {
  IoMdArrowDropright,
  IoMdAdd,
  IoMdNotificationsOutline,
} from "react-icons/io";
import { TbCalendarDue } from "react-icons/tb";
import { BsClipboardCheck } from "react-icons/bs";
import { BiTaskX } from "react-icons/bi";
import { GoTasklist } from "react-icons/go";

import CreateWorkSpacePopup from "./CreateWorkSpacePopup";
import ThemeToggle from "./ThemeToggle";
import AddTaskPopup from "./AddTaskPopup";
import { useUserContext } from "@/context/userContext";

const NavbarComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoggedIn, isLoading, emailVerified, isProfileCreated } =
    useUserContext();

  const [openTasksSection, setOpenTasksSection] = useState(false);
  const [openWorkSpaceSection, setOpenWorkSpaceSection] = useState(false);
  const [CreateWorkspacePopupNum, setCreateWorkspacePopupNum] = useState(0);
  const [AddTaskPopupNum, setAddTaskPopupNum] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check if current page should show the sidebar navbar
  const shouldShowSidebar = () => {
    const authPages = [
      "/log-in",
      "/sign-up",
      "/CreateProfile",
      "/",
      "/verify-email",
    ];
    return !authPages.includes(pathname) && isUserLoggedIn && isProfileCreated;
  };

  // Check if current page should show the top navbar (for landing page)
  const shouldShowTopNavbar = () => {
    return pathname === "/" && !isUserLoggedIn;
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle sidebar collapse toggle
  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);

    // Dispatch custom event to communicate with app layout
    window.dispatchEvent(
      new CustomEvent("sidebarToggle", {
        detail: { isCollapsed: newCollapsedState },
      })
    );
  };

  // Render sidebar navbar for authenticated users
  if (shouldShowSidebar()) {
    return (
      <>
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <nav
          className={`fixed top-0 left-0 p-2 bg-gray-50 dark:bg-gray-800 transition-all duration-300 flex flex-col min-h-screen z-50 border-r border-gray-200 dark:border-gray-700 ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          } ${isCollapsed ? "lg:w-[80px]" : "w-[240px]"}`}
        >
          <div
            className={`flex ${
              isCollapsed
                ? "flex-col justify-center items-center"
                : "justify-between"
            } gap-3 items-center my-4 mx-auto`}
          >
            {isCollapsed ? (
              <button
                onClick={handleCollapseToggle}
                className="hidden lg:block p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Expand sidebar"
              >
                <svg
                  className="w-5 h-5 rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
            ) : (
              <>
                <h1 className="text-xl font-bold text-black dark:text-slate-200">
                  Task Manager
                </h1>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  {/* Desktop Collapse Button */}
                  <button
                    onClick={handleCollapseToggle}
                    className="hidden lg:block p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  >
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        isCollapsed ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  {/* Mobile Close Button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="lg:hidden p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* User Profile Section */}
          <div>
            <div
              className={`bg-white dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer hover:shadow-md transition-all shadow-sm flex ${
                isCollapsed
                  ? "justify-center aspect-square"
                  : "flex-row items-center gap-2"
              }  p-2 rounded-lg m-2`}
              onClick={() => {
                router.push(`/Profile`);
                setIsMobileMenuOpen(false); // Close mobile menu
              }}
              title={
                isCollapsed && user ? `${user.name} (@${user.username})` : ""
              }
            >
              {isLoading || !user ? (
                <div className="loader w-9 h-9 border-[4px] border-gray-300 dark:border-gray-600"></div>
              ) : (
                <>
                  <div className="profilePhoto relative w-10 h-10 aspect-square">
                    <Image
                      src={
                        user.photoURL ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      className="rounded-2xl aspect-square"
                      fill
                      alt="profile-picture"
                    />
                  </div>
                  {!isCollapsed && (
                    <div className="flex flex-col">
                      <h2 className="text-[14px] font-semibold">
                        {user.name || "User"}
                      </h2>
                      <p className="text-xs text-gray-400">{user.username}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex flex-col min-h-[80vh] mt-0 gap-10 justify-between">
            <div className="mt-1">
              <ul>
                {[
                  {
                    name: "Dashboard",
                    icon: <MdOutlineDashboard />,
                    url: `/Dashboard`,
                    activatedIcon: <MdDashboard />,
                  },
                  {
                    name: "Notifications",
                    icon: <IoMdNotificationsOutline />,
                    url: `/Notifications/all/${user?.username}`,
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
                        url: `/YourTasks/DueTasks/${user?.username}`,
                        icon: <TbCalendarDue />,
                      },
                      {
                        title: "Completed tasks",
                        url: `/YourTasks/CompletedTasks/${user?.username}`,
                        icon: <BsClipboardCheck />,
                      },
                      {
                        title: "Uncompleted tasks",
                        url: `/YourTasks/UncompletedTasks/${user?.username}`,
                        icon: <BiTaskX />,
                      },
                      {
                        title: "All tasks",
                        url: `/YourTasks/AllTasks/${user?.username}`,
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
                    subSections: user?.workspaces || [],
                  },
                ].map((item, index) => (
                  <li key={index} className="">
                    <div
                      className={`${
                        pathname === item.url
                          ? "text-thm-clr-1 dark:text-blue-500"
                          : "text-black dark:text-slate-200"
                      } ${
                        (item.name === "Your tasks" && openTasksSection) ||
                        (item.name === "Workspace" && openWorkSpaceSection)
                          ? "bg-gray-200 dark:bg-gray-700"
                          : ""
                      } flex flex-row gap-2 ${
                        isCollapsed ? "justify-center" : "justify-between"
                      } items-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer m-2 p-2 rounded-md`}
                      onClick={() => {
                        if (item.name === "Your tasks") {
                          if (isCollapsed) {
                            setIsCollapsed(false); // Expand when accessing submenus in collapsed mode
                          }
                          setOpenTasksSection(!openTasksSection);
                        } else if (item.name === "Workspace") {
                          if (isCollapsed) {
                            setIsCollapsed(false); // Expand when accessing submenus in collapsed mode
                          }
                          setOpenWorkSpaceSection(!openWorkSpaceSection);
                        } else {
                          router.push(item.url);
                          setIsMobileMenuOpen(false); // Close mobile menu
                        }
                      }}
                      title={isCollapsed ? item.name : ""}
                    >
                      <div
                        className={`flex items-center gap-2 ${
                          isCollapsed ? "justify-center" : "flex-row"
                        }`}
                      >
                        <div className="text-lg">{item.icon}</div>
                        {!isCollapsed && (
                          <h2 className="text-sm font-semibold">{item.name}</h2>
                        )}
                      </div>
                      {!isCollapsed && (
                        <div
                          className={`${
                            (item.name === "Your tasks" && openTasksSection) ||
                            (item.name === "Workspace" && openWorkSpaceSection)
                              ? "block rotate-90"
                              : "hidden"
                          } transition-all`}
                        >
                          {(item.name === "Workspace" ||
                            item.name === "Your tasks") && (
                            <IoMdArrowDropright />
                          )}
                        </div>
                      )}
                    </div>
                    {/* Submenu for Your Tasks */}
                    <div className={`${isCollapsed ? "hidden" : "ml-6"} m-2`}>
                      {item.name === "Your tasks" &&
                        openTasksSection &&
                        !isCollapsed && (
                          <div className="transition-all">
                            {item.subSections.map((section, index) => (
                              <div
                                key={index}
                                className={`
                                ${
                                  pathname === section.url
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
                                  if (section.title === "Add new task") {
                                    setAddTaskPopupNum(AddTaskPopupNum + 1);
                                  } else {
                                    router.push(section.url);
                                    setIsMobileMenuOpen(false); // Close mobile menu
                                  }
                                }}
                              >
                                <div className="icon text-lg font-bold">
                                  {section.icon}
                                </div>
                                <span>{section.title}</span>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Submenu for Workspace */}
                      {item.name === "Workspace" &&
                        openWorkSpaceSection &&
                        !isCollapsed && (
                          <div className="flex flex-col">
                            <div className="workspaceScrollBar max-h-[268px] overflow-auto">
                              {!item.subSections ||
                              item.subSections.length === 0 ? (
                                <span className="text-gray-400 text-xs">
                                  No workspace found
                                </span>
                              ) : (
                                item.subSections.map((subSection, index) => (
                                  <div
                                    key={index}
                                    className={`
                                    ${
                                      pathname === subSection.url
                                        ? "text-thm-clr-1 dark:text-blue-500"
                                        : "text-black dark:text-slate-200"
                                    }
                                    cursor-pointer transition-all hover:bg-gray-200 dark:hover:bg-gray-700 my-1 rounded-md flex flex-row items-center justify-between gap-2 p-2 font-semibold text-xs`}
                                    onClick={() => {
                                      router.push(subSection.url);
                                      setIsMobileMenuOpen(false); // Close mobile menu
                                    }}
                                  >
                                    <div className="icon flex gap-2 items-center font-bold">
                                      <span
                                        className={`${
                                          subSection.customizedLogo?.bg ||
                                          "bg-gray-200"
                                        } ${
                                          subSection.customizedLogo?.text
                                            ? `text-${subSection.customizedLogo.text}`
                                            : "text-gray-600"
                                        } cursor-pointer font-semibold text-center flex items-center justify-center text-xs rounded-lg w-6 h-6`}
                                      >
                                        <span>
                                          {subSection.LogoLetter ||
                                            subSection.workspaceTitle?.[0] ||
                                            "W"}
                                        </span>
                                      </span>
                                      <span>{subSection.workspaceTitle}</span>
                                    </div>
                                    {subSection.isPrivate && (
                                      <div className="flex fill-black dark:fill-slate-300 justify-center items-center">
                                        <svg
                                          className="lock-svgIcon w-3 h-3"
                                          viewBox="-0.5 -0.5 16 16"
                                        >
                                          <path
                                            d="M7.5 8.235c-0.1949375 0 -0.38187499999999996 0.0775 -0.5196875 0.2153125s-0.2153125 0.32475 -0.2153125 0.5196875v2.205c0 0.1949375 0.0775 0.38187499999999996 0.2153125 0.51975s0.32475 0.21525 0.5196875 0.21525c0.1949375 0 0.3819375 -0.07743749999999999 0.51975 -0.21525s0.21525 -0.32481250000000006 0.21525 -0.51975v-2.205c0 -0.1949375 -0.07743749999999999 -0.38187499999999996 -0.21525 -0.5196875s-0.32481250000000006 -0.2153125 -0.51975 -0.2153125Zm3.675 -2.94V3.825c0 -0.9746875 -0.3871875 -1.9094375 -1.076375 -2.598625S8.4746875 0.15 7.5 0.15c-0.9746875 0 -1.9094375 0.3871875 -2.598625 1.076375S3.825 2.8503125000000002 3.825 3.825v1.47c-0.5848125 0 -1.145625 0.23231249999999998 -1.5591875 0.6458125000000001C1.8523124999999998 6.354375 1.62 6.9152499999999995 1.62 7.5v5.145c0 0.58475 0.23231249999999998 1.145625 0.6458125000000001 1.5591875 0.41356249999999994 0.4135 0.974375 0.6458125000000001 1.5591875 0.6458125000000001h7.35c0.58475 0 1.145625 -0.23231249999999998 1.5591875 -0.6458125000000001 0.4135 -0.41356249999999994 0.6458125000000001 -0.9744375 0.6458125000000001 -1.5591875V7.5c0 -0.58475 -0.23231249999999998 -1.145625 -0.6458125000000001 -1.5591875 -0.41356249999999994 -0.4135 -0.9744375 -0.6458125000000001 -1.5591875 -0.6458125000000001ZM5.295 3.825c0 -0.5848125 0.23231249999999998 -1.145625 0.6458125000000001 -1.5591875C6.354375 1.8523124999999998 6.9152499999999995 1.62 7.5 1.62s1.145625 0.23231249999999998 1.5591875 0.6458125000000001c0.4135 0.41356249999999994 0.6458125000000001 0.974375 0.6458125000000001 1.5591875v1.47H5.295V3.825Zm6.615 8.82c0 0.1949375 -0.07743749999999999 0.3819375 -0.21525 0.51975s-0.32481250000000006 0.21525 -0.51975 0.21525H3.825c-0.1949375 0 -0.38187499999999996 -0.07743749999999999 -0.51975 -0.21525 -0.1378125 -0.1378125 -0.21525 -0.32481250000000006 -0.21525 -0.51975V7.5c0 -0.1949375 0.07743749999999999 -0.38187499999999996 0.21525 -0.5196875 0.137875 -0.1378125 0.32481250000000006 -0.2153125 0.51975 -0.2153125h7.35c0.1949375 0 0.3819375 0.0775 0.51975 0.2153125s0.21525 0.32475 0.21525 0.5196875v5.145Z"
                                            fill=""
                                            strokeWidth="1"
                                          />
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
                                setCreateWorkspacePopupNum(
                                  CreateWorkspacePopupNum + 1
                                );
                              }}
                            >
                              <IoMdAdd />
                              <span>Add new workspace</span>
                            </button>
                          </div>
                        )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Navigation - Settings and Logout */}
            <div>
              <ul>
                {[
                  {
                    name: "Settings",
                    icon: <MdOutlineSettings />,
                    url: `/Settings`,
                  },
                  {
                    name: "Log out",
                    icon: <MdLogout />,
                    url: "/",
                  },
                ].map((item, index) => (
                  <li
                    key={index}
                    className={`${
                      item.name === "Log out"
                        ? "text-red-500 dark:text-red-500"
                        : pathname === item.url
                        ? "text-thm-clr-1 dark:text-blue-500"
                        : "text-black dark:text-slate-200"
                    } cursor-pointer m-2 flex flex-row gap-2 ${
                      isCollapsed ? "justify-center" : "items-center"
                    } hover:bg-gray-200 dark:hover:bg-gray-700 transition-all rounded-md p-2`}
                    onClick={() => {
                      if (item.name === "Log out") {
                        handleLogout();
                      } else {
                        router.push(item.url);
                        setIsMobileMenuOpen(false); // Close mobile menu
                      }
                    }}
                    title={isCollapsed ? item.name : ""}
                  >
                    <div className="text-lg">{item.icon}</div>
                    {!isCollapsed && (
                      <h2 className="text-sm font-semibold">{item.name}</h2>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* Popups */}
        <CreateWorkSpacePopup
          createPopupNum={CreateWorkspacePopupNum}
          uname={user?.username}
          uniqID={user?.uid}
          workspacearray={user?.workspaces || []}
          email={user?.email}
          name={user?.name || ""}
          photoUrl={user?.photoURL}
        />
        <AddTaskPopup
          addTaskPopupNum={AddTaskPopupNum}
          username={user?.username}
        />
      </>
    );
  }

  // Render top navbar for landing page
  if (shouldShowTopNavbar()) {
    return (
      <nav className="fixed w-screen top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex flex-row justify-center m-3 items-center">
          <ul className="flex flex-row items-center justify-between w-[70%]">
            <li>
              <h1 className="text-2xl font-bold text-black dark:text-white">
                Task Manager
              </h1>
            </li>
            <li>
              <div className="flex justify-evenly gap-7">
                <button
                  className="p-1 px-5 rounded-md hover:bg-transparent font-semibold border-2 border-thm-clr-1 transition-all hover:text-black text-white bg-thm-clr-1"
                  onClick={() => router.push("/sign-up")}
                >
                  <span>Sign up</span>
                </button>
                <button
                  className="p-1 px-5 rounded-md hover:bg-transparent font-semibold border-2 border-thm-clr-2 transition-all hover:text-black text-black bg-thm-clr-2"
                  onClick={() => router.push("/log-in")}
                >
                  <span>Sign in</span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  // Return null for auth pages (no navbar)
  return null;
};

const Navbar = () => {
  return (
    <Suspense>
      <NavbarComponent />
    </Suspense>
  );
};

export default Navbar;
