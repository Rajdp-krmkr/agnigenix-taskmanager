"use client";
import { useUserContext } from "@/context/userContext";
import fetchCurrentProject from "@/lib/utils/fetchCurrentProject";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import {
  FaRocket,
  FaTasks,
  FaCheckCircle,
  FaHourglassHalf,
  FaUsers,
  FaChartBar,
  FaListAlt,
  FaUserFriends,
  FaEye,
  FaCalendarAlt,
  FaEllipsisV,
} from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import {
  MdBarChart,
  MdCheckCircle,
  MdGroup,
  MdTask,
  MdTimeline,
  MdKeyboardArrowDown,
} from "react-icons/md";
import Image from "next/image";

const Project = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const {
    isCurrentProjectLoading,
    setIsCurrentProjectLoading,
    currentProject,
    setCurrentProject,
  } = useUserContext();

  const [activeTab, setActiveTab] = useState("overview");
  const [showDetails, setShowDetails] = useState(false);

  // Memoized dummy data for project
  const dummyProject = useMemo(
    () => ({
      id: id || "proj-001",
      title: "Agnigenix Task Manager",
      description:
        "A comprehensive task management system with real-time collaboration, user management, and workspace organization features.",
      status: "In Progress",
      priority: "High",
      progress: 65,
      createdAt: "2025-08-01",
      dueDate: "2025-12-15",
      icon: <FaRocket />,
      color: "#3B82F6",
      members: [
        {
          id: "user-1",
          name: "Rajdeep Karmakar",
          username: "rajdp-krmkr",
          role: "Project Manager",
          avatar: "/public/icons/github-mark.png",
          status: "online",
        },
        {
          id: "user-2",
          name: "Sarah Johnson",
          username: "sarah.j",
          role: "Frontend Developer",
          avatar: "/public/icons/github-mark.png",
          status: "online",
        },
        {
          id: "user-3",
          name: "Mike Chen",
          username: "mike.chen",
          role: "Backend Developer",
          avatar: "/public/icons/github-mark.png",
          status: "away",
        },
        {
          id: "user-4",
          name: "Emma Wilson",
          username: "emma.w",
          role: "UI/UX Designer",
          avatar: "/public/icons/github-mark.png",
          status: "offline",
        },
      ],
      tasks: [
        {
          id: "task-1",
          title: "Design user authentication flow",
          description: "Create wireframes and mockups for login/signup process",
          status: "completed",
          priority: "high",
          assignee: {
            name: "Emma Wilson",
            avatar: "/public/icons/github-mark.png",
          },
          dueDate: "2025-08-15",
          labels: ["design", "auth"],
        },
        {
          id: "task-2",
          title: "Implement user search functionality",
          description:
            "Build real-time user search with debouncing and filtering",
          status: "in-progress",
          priority: "high",
          assignee: {
            name: "Sarah Johnson",
            avatar: "/public/icons/github-mark.png",
          },
          dueDate: "2025-08-28",
          labels: ["frontend", "search"],
        },
        {
          id: "task-3",
          title: "Setup Firebase authentication",
          description:
            "Configure Firebase auth with email/password and Google sign-in",
          status: "completed",
          priority: "medium",
          assignee: {
            name: "Mike Chen",
            avatar: "/public/icons/github-mark.png",
          },
          dueDate: "2025-08-10",
          labels: ["backend", "auth"],
        },
        {
          id: "task-4",
          title: "Create project dashboard",
          description:
            "Build responsive dashboard with project overview and statistics",
          status: "todo",
          priority: "medium",
          assignee: {
            name: "Sarah Johnson",
            avatar: "/public/icons/github-mark.png",
          },
          dueDate: "2025-09-05",
          labels: ["frontend", "dashboard"],
        },
        {
          id: "task-5",
          title: "Implement real-time notifications",
          description: "Add real-time notification system for task updates",
          status: "todo",
          priority: "low",
          assignee: {
            name: "Mike Chen",
            avatar: "/public/icons/github-mark.png",
          },
          dueDate: "2025-09-20",
          labels: ["backend", "notifications"],
        },
      ],
      recentActivity: [
        {
          id: "activity-1",
          type: "task_completed",
          user: "Emma Wilson",
          action: "completed task",
          target: "Design user authentication flow",
          timestamp: "2 hours ago",
        },
        {
          id: "activity-2",
          type: "comment",
          user: "Sarah Johnson",
          action: "commented on",
          target: "Implement user search functionality",
          timestamp: "4 hours ago",
        },
        {
          id: "activity-3",
          type: "task_assigned",
          user: "Rajdeep Karmakar",
          action: "assigned task to Mike Chen",
          target: "Implement real-time notifications",
          timestamp: "1 day ago",
        },
      ],
    }),
    [id]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchProject = async () => {
      setIsCurrentProjectLoading(true);
      try {
        // For now, use dummy data
        // const project = await fetchCurrentProject(id);
        if (isMounted) {
          setCurrentProject(dummyProject);
          setIsCurrentProjectLoading(false);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        if (isMounted) {
          setCurrentProject(dummyProject); // Fallback to dummy data
          setIsCurrentProjectLoading(false);
        }
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
      setIsCurrentProjectLoading(false);
    };
  }, [id, dummyProject, setCurrentProject, setIsCurrentProjectLoading]);

  const project = currentProject || dummyProject;

  if (isCurrentProjectLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="typewriter">
          <div className="slide">
            <i></i>
          </div>
          <div className="paper"></div>
          <div className="keyboard"></div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "todo":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUserStatus = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <MdTask className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tasks
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {project.tasks.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <MdCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {
                  project.tasks.filter((task) => task.status === "completed")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <FaHourglassHalf className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                In Progress
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {
                  project.tasks.filter((task) => task.status === "in-progress")
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <MdGroup className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Team Members
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {project.members.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Project Progress
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Overall Progress
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {project.progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <p className="font-medium text-gray-900 dark:text-white">
              Start Date
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900 dark:text-white">
              Due Date
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {new Date(project.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900 dark:text-white">
              Priority
            </p>
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                project.priority.toLowerCase()
              )}`}
            >
              {project.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {project.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <FaEye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  <span className="font-medium">{activity.user}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-4">
      {project.tasks.map((task) => (
        <div
          key={task.id}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {task.title}
                </h3>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status.replace("-", " ")}
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {task.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Image
                    src="/icons/github-mark.png"
                    alt={task.assignee.name}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <span>{task.assignee.name}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {task.labels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="ml-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <FaEllipsisV className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTeam = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {project.members.map((member) => (
        <div
          key={member.id}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Image
                src="/icons/github-mark.png"
                alt={member.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 ${getUserStatus(
                  member.status
                )} rounded-full border-2 border-white dark:border-gray-800`}
              ></div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {member.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                @{member.username}
              </p>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {member.role}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span
                className={`capitalize font-medium ${
                  member.status === "online"
                    ? "text-green-600 dark:text-green-400"
                    : member.status === "away"
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {member.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800   shadow-sm border dark:border-gray-700 ">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl"
                style={{
                  backgroundColor: project.color + "20",
                  color: project.color,
                }}
              >
                {project.icon}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {project.title}
                  </h1>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label={showDetails ? "Hide details" : "Show details"}
                  >
                    <MdKeyboardArrowDown 
                      className={`w-6 h-6 transform transition-transform duration-200 ${
                        showDetails ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    showDetails ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                        project.status.toLowerCase().replace(" ", "-")
                      )}`}
                    >
                      {project.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Project ID: {project.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add Task
              </button>
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview", icon: <MdBarChart /> },
              { id: "tasks", label: "Tasks", icon: <FaCheckCircle /> },
              { id: "team", label: "Team", icon: <FaUserFriends /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <span className="mr-2 inline-flex items-center">
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "tasks" && renderTasks()}
          {activeTab === "team" && renderTeam()}
        </div>
      </div>
    </div>
  );
};

export default Project;
