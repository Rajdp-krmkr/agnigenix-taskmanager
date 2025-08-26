"use client";
import { auth } from "@/lib/firebaseConfig";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState, useMemo } from "react";
import { LiaProjectDiagramSolid } from "react-icons/lia";

import {
  MdOutlineDashboard,
  MdDashboard,
  MdOutlineWorkOutline,
  MdOutlineWork,
  MdOutlineSettings,
  MdLogout,
} from "react-icons/md";
import { FaTasks } from "react-icons/fa";
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
import { fetchWorkspaces } from "@/lib/utils/fetchWorkspaces";
import { FaDiagramProject } from "react-icons/fa6";

// Constants
const AUTH_PAGES = [
  "/log-in",
  "/sign-up",
  "/CreateProfile",
  "/",
  "/verify-email",
];

// Navigation configuration
const createNavItems = (username) => [
  {
    name: "Dashboard",
    icon: <MdOutlineDashboard />,
    activeIcon: <MdDashboard />,
    url: `/Dashboard`,
  },
  {
    name: "Notifications",
    icon: <IoMdNotificationsOutline />,
    activeIcon: <IoMdNotificationsOutline />,
    url: `/Notifications/all/${username}`,
  },
  {
    name: "Your tasks",
    icon: <FaTasks />,
    hasSubMenu: true,
    subItems: [
      {
        title: "Due tasks",
        url: `/YourTasks/DueTasks/${username}`,
        icon: <TbCalendarDue />,
      },
      {
        title: "Completed tasks",
        url: `/YourTasks/CompletedTasks/${username}`,
        icon: <BsClipboardCheck />,
      },
      {
        title: "Uncompleted tasks",
        url: `/YourTasks/UncompletedTasks/${username}`,
        icon: <BiTaskX />,
      },
      {
        title: "All tasks",
        url: `/YourTasks/AllTasks/${username}`,
        icon: <GoTasklist />,
      },
      {
        title: "Add new task",
        action: "addTask",
        icon: <IoMdAdd />,
      },
    ],
  },
  {
    name: "Workspaces",
    icon: <MdOutlineWorkOutline />,
    activeIcon: <MdOutlineWork />,
    hasSubMenu: true,
    isWorkspace: true,
  },
  {
    name: "Projects",
    icon: <LiaProjectDiagramSolid />,
    activeIcon: <FaDiagramProject />,
    url: `/projects`,
  },
];

const BOTTOM_NAV_ITEMS = [
  { name: "Settings", icon: <MdOutlineSettings />, url: `/Settings` },
  // { name: "Log out", icon: <MdLogout />, action: "logout" },
];

// Sub-components
const CollapseButton = ({ isCollapsed, onClick, isMobile = false }) => (
  <button
    onClick={onClick}
    className={`${
      isMobile ? "lg:hidden" : "hidden lg:block"
    } p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
  >
    {isMobile ? (
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
    ) : (
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
    )}
  </button>
);

const UserProfile = ({ user, isLoading, isCollapsed, onProfileClick }) => (
  <div
    className={`bg-white dark:bg-gray-700 dark:hover:bg-gray-600 cursor-pointer hover:shadow-md transition-all shadow-sm flex ${
      isCollapsed
        ? "justify-center aspect-square"
        : "flex-row items-center gap-2"
    } p-2 rounded-lg m-2`}
    onClick={onProfileClick}
    title={isCollapsed && user ? `${user.name} (@${user.username})` : ""}
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
            <h2 className="text-[14px] font-semibold">{user.name || "User"}</h2>
            <p className="text-xs text-gray-400">{user.username}</p>
          </div>
        )}
      </>
    )}
  </div>
);

const NavItem = ({
  item,
  isActive,
  isCollapsed,
  onClick,
  isExpanded = false,
}) => (
  <div
    className={`${
      isActive
        ? "text-thm-clr-1 dark:text-blue-500"
        : "text-black dark:text-slate-200"
    } ${isExpanded ? "bg-gray-200 dark:bg-gray-700" : ""} flex flex-row gap-2 ${
      isCollapsed ? "justify-center" : "justify-between"
    } items-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer m-2 p-2 rounded-md`}
    onClick={onClick}
    title={isCollapsed ? item.name : ""}
  >
    <div
      className={`flex items-center gap-2 ${
        isCollapsed ? "justify-center" : "flex-row"
      }`}
    >
      <div className="text-lg">{item.icon}</div>
      {!isCollapsed && <h2 className="text-sm font-semibold">{item.name}</h2>}
    </div>
    {!isCollapsed && item.hasSubMenu && (
      <div className={`${isExpanded ? "rotate-90" : ""} transition-all`}>
        <IoMdArrowDropright />
      </div>
    )}
  </div>
);

const SubMenuItem = ({ item, isActive, onClick }) => (
  <div
    className={`${
      isActive
        ? "text-thm-clr-1 dark:text-blue-500"
        : "text-black dark:text-slate-200"
    } ${
      item.title === "Add new task"
        ? "bg-thm-clr-1 text-white hover:bg-thm-clr-2 dark:hover:text-black"
        : "hover:bg-gray-200 dark:hover:bg-gray-700"
    } cursor-pointer my-1 rounded-md flex flex-row items-center gap-2 p-2 font-semibold text-xs transition-all`}
    onClick={onClick}
  >
    <div className="text-lg">{item.icon}</div>
    <span>{item.title}</span>
  </div>
);

const WorkspaceItem = ({ workspace, isActive, onClick }) => (
  <div
    className={`${
      isActive
        ? "text-thm-clr-1 dark:text-blue-500 bg-gray-200 dark:bg-gray-700"
        : "text-black dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-gray-700"
    } cursor-pointer transition-all my-1 rounded-md flex flex-row items-center justify-between gap-2 p-2 font-semibold text-xs`}
    onClick={onClick}
  >
    <div className="flex gap-2 items-center">
      <span
        className={`${workspace.logo?.bg || "bg-gray-200"} ${
          workspace.logo?.textColor
            ? `text-${workspace.logo.textColor}`
            : "text-gray-600"
        } font-semibold text-center flex items-center justify-center text-xs rounded-lg w-6 h-6`}
      >
        {workspace.logo?.text || workspace.workspaceTitle?.[0] || "W"}
      </span>
      <span>{workspace.workspaceTitle}</span>
    </div>
    {workspace.isPrivate && (
      <svg
        className="w-3 h-3 fill-black dark:fill-slate-300"
        viewBox="-0.5 -0.5 16 16"
      >
        <path d="M7.5 8.235c-0.1949375 0 -0.38187499999999996 0.0775 -0.5196875 0.2153125s-0.2153125 0.32475 -0.2153125 0.5196875v2.205c0 0.1949375 0.0775 0.38187499999999996 0.2153125 0.51975s0.32475 0.21525 0.5196875 0.21525c0.1949375 0 0.3819375 -0.07743749999999999 0.51975 -0.21525s0.21525 -0.32481250000000006 0.21525 -0.51975v-2.205c0 -0.1949375 -0.07743749999999999 -0.38187499999999996 -0.21525 -0.5196875s-0.32481250000000006 -0.2153125 -0.51975 -0.2153125Zm3.675 -2.94V3.825c0 -0.9746875 -0.3871875 -1.9094375 -1.076375 -2.598625S8.4746875 0.15 7.5 0.15c-0.9746875 0 -1.9094375 0.3871875 -2.598625 1.076375S3.825 2.8503125000000002 3.825 3.825v1.47c-0.5848125 0 -1.145625 0.23231249999999998 -1.5591875 0.6458125000000001C1.8523124999999998 6.354375 1.62 6.9152499999999995 1.62 7.5v5.145c0 0.58475 0.23231249999999998 1.145625 0.6458125000000001 1.5591875 0.41356249999999994 0.4135 0.974375 0.6458125000000001 1.5591875 0.6458125000000001h7.35c0.58475 0 1.145625 -0.23231249999999998 1.5591875 -0.6458125000000001 0.4135 -0.41356249999999994 0.6458125000000001 -0.9744375 0.6458125000000001 -1.5591875V7.5c0 -0.58475 -0.23231249999999998 -1.145625 -0.6458125000000001 -1.5591875 -0.41356249999999994 -0.4135 -0.9744375 -0.6458125000000001 -1.5591875 -0.6458125000000001ZM5.295 3.825c0 -0.5848125 0.23231249999999998 -1.145625 0.6458125000000001 -1.5591875C6.354375 1.8523124999999998 6.9152499999999995 1.62 7.5 1.62s1.145625 0.23231249999999998 1.5591875 0.6458125000000001c0.4135 0.41356249999999994 0.6458125000000001 0.974375 0.6458125000000001 1.5591875v1.47H5.295V3.825Zm6.615 8.82c0 0.1949375 -0.07743749999999999 0.3819375 -0.21525 0.51975s-0.32481250000000006 0.21525 -0.51975 0.21525H3.825c-0.1949375 0 -0.38187499999999996 -0.07743749999999999 -0.51975 -0.21525 -0.1378125 -0.1378125 -0.21525 -0.32481250000000006 -0.21525 -0.51975V7.5c0 -0.1949375 0.07743749999999999 -0.38187499999999996 0.21525 -0.5196875 0.137875 -0.1378125 0.32481250000000006 -0.2153125 0.51975 -0.2153125h7.35c0.1949375 0 0.3819375 0.0775 0.51975 0.2153125s0.21525 0.32475 0.21525 0.5196875v5.145Z" />
      </svg>
    )}
  </div>
);

const NavbarComponent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoggedIn, isLoading, isProfileCreated } =
    useUserContext();

  // State management
  const [expandedSections, setExpandedSections] = useState({
    tasks: false,
    workspaces: false,
  });
  const [popupCounters, setPopupCounters] = useState({
    workspace: 0,
    task: 0,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [isWorkspacesLoading, setIsWorkspacesLoading] = useState(true);

  // Memoized navigation items
  const navItems = useMemo(
    () => createNavItems(user?.username),
    [user?.username]
  );

  // Page visibility logic
  const shouldShowSidebar = () =>
    !AUTH_PAGES.includes(pathname) && isUserLoggedIn && isProfileCreated;

  const shouldShowTopNavbar = () => pathname === "/" && !isUserLoggedIn;

  // Event handlers
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    window.dispatchEvent(
      new CustomEvent("sidebarToggle", {
        detail: { isCollapsed: newCollapsedState },
      })
    );
  };

  const toggleSection = (section) => {
    if (isCollapsed) setIsCollapsed(false);
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleNavigation = (url) => {
    router.push(url);
    setIsMobileMenuOpen(false);
  };

  const handleAction = (action) => {
    switch (action) {
      case "logout":
        handleLogout();
        break;
      case "addTask":
        setPopupCounters((prev) => ({ ...prev, task: prev.task + 1 }));
        break;
      case "addWorkspace":
        setPopupCounters((prev) => ({
          ...prev,
          workspace: prev.workspace + 1,
        }));
        break;
      default:
        break;
    }
  };

  // Fetch workspaces effect
  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!user?.workspaces) return;
      try {
        const res = await fetchWorkspaces(user.workspaces);
        setWorkspaces(res);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      } finally {
        setIsWorkspacesLoading(false);
      }
    };
    fetchWorkspace();
  }, [user]);

  // Sidebar render
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
          {/* Header */}
          <div
            className={`flex ${
              isCollapsed
                ? "flex-col justify-center items-center"
                : "justify-between"
            } gap-3 items-center my-4 mx-auto`}
          >
            {isCollapsed ? (
              <CollapseButton
                isCollapsed={isCollapsed}
                onClick={handleCollapseToggle}
              />
            ) : (
              <>
                <h1 className="text-xl font-bold text-black dark:text-slate-200">
                  Task Manager
                </h1>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <CollapseButton
                    isCollapsed={isCollapsed}
                    onClick={handleCollapseToggle}
                  />
                  <CollapseButton
                    isCollapsed={isCollapsed}
                    onClick={() => setIsMobileMenuOpen(false)}
                    isMobile
                  />
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <UserProfile
            user={user}
            isLoading={isLoading}
            isCollapsed={isCollapsed}
            onProfileClick={() => handleNavigation("/Profile")}
          />

          {/* Navigation Menu */}
          <div className="flex flex-col flex-1 mt-0 gap-10 justify-between">
            <div className="mt-1">
              <ul>
                {navItems.map((item, index) => (
                  <li key={index}>
                    <NavItem
                      item={item}
                      isActive={pathname === item.url}
                      isCollapsed={isCollapsed}
                      isExpanded={
                        (item.name === "Your tasks" &&
                          expandedSections.tasks) ||
                        (item.name === "Workspaces" &&
                          expandedSections.workspaces)
                      }
                      onClick={() => {
                        if (item.hasSubMenu) {
                          if (item.isWorkspace) {
                            toggleSection("workspaces");
                          } else {
                            toggleSection("tasks");
                          }
                        } else {
                          handleNavigation(item.url);
                        }
                      }}
                    />

                    {/* Sub-menus */}
                    {!isCollapsed && (
                      <div className="ml-6 m-2">
                        {/* Tasks Submenu */}
                        {item.name === "Your tasks" &&
                          expandedSections.tasks && (
                            <div className="transition-all">
                              {item.subItems.map((subItem, subIndex) => (
                                <SubMenuItem
                                  key={subIndex}
                                  item={subItem}
                                  isActive={pathname === subItem.url}
                                  onClick={() => {
                                    if (subItem.action) {
                                      handleAction(subItem.action);
                                    } else {
                                      handleNavigation(subItem.url);
                                    }
                                  }}
                                />
                              ))}
                            </div>
                          )}

                        {/* Workspaces Submenu */}
                        {item.name === "Workspaces" &&
                          expandedSections.workspaces && (
                            <div className="flex flex-col">
                              <div className="workspaceScrollBar max-h-[268px] overflow-auto">
                                {isWorkspacesLoading ? (
                                  <div>Loading...</div>
                                ) : workspaces.length === 0 ? (
                                  <span className="text-gray-400 text-xs">
                                    No workspace found
                                  </span>
                                ) : (
                                  workspaces.map(
                                    (workspace, workspaceIndex) => (
                                      <WorkspaceItem
                                        key={workspaceIndex}
                                        workspace={workspace}
                                        isActive={
                                          pathname ===
                                          `/Workspaces/${workspace?.workspaceID}`
                                        }
                                        onClick={() =>
                                          handleNavigation(
                                            `/Workspaces/${workspace?.workspaceID}`
                                          )
                                        }
                                      />
                                    )
                                  )
                                )}
                              </div>
                              <button
                                className="bg-thm-clr-1 my-4 text-white transition-all hover:text-black hover:bg-thm-clr-2 cursor-pointer rounded-md flex flex-row items-center gap-2 p-2 font-semibold text-xs"
                                onClick={() => handleAction("addWorkspace")}
                              >
                                <IoMdAdd />
                                <span>Add new workspace</span>
                              </button>
                            </div>
                          )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Navigation */}
            <div>
              <ul>
                {BOTTOM_NAV_ITEMS.map((item, index) => (
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
                      if (item.action) {
                        handleAction(item.action);
                      } else {
                        handleNavigation(item.url);
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
        <React.Suspense fallback={null}>
          {user?.username && (
            <>
              <CreateWorkSpacePopup
                createPopupNum={popupCounters?.workspace || 0}
                uname={user?.username}
                name={user?.name || ""}
                uniqID={user?.uid}
                workspacearray={user?.workspaces || []}
                email={user?.email}
                photoUrl={user?.photoURL}
              />
              {/* <AddTaskPopup
                addTaskPopupNum={popupCounters?.task || 0}
                username={user?.username}
              /> */}
            </>
          )}
        </React.Suspense>
      </>
    );
  }

  // Top navbar for landing page
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
                  Sign up
                </button>
                <button
                  className="p-1 px-5 rounded-md hover:bg-transparent font-semibold border-2 border-thm-clr-2 transition-all hover:text-black text-black bg-thm-clr-2"
                  onClick={() => router.push("/log-in")}
                >
                  Sign in
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  return null;
};

export default NavbarComponent;
