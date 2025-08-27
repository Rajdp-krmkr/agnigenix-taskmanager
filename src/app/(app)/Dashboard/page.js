"use client";
import ThemeToggle from "@/components/ThemeToggle";
import { useUserContext } from "@/context/userContext";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  MdOutlineDashboard,
  MdOutlineWork,
  MdAdd,
  MdTrendingUp,
  MdCheckCircle,
  MdSchedule,
  MdGroup,
  MdAssignment,
} from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { TbCalendarDue } from "react-icons/tb";
import { BsClipboardCheck } from "react-icons/bs";
import { BiTaskX } from "react-icons/bi";
import TypeWriterLoader from "@/components/typewriterloader";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  // const username = params.user;
  const {
    user,
    setUser,
    isUserLoggedIn,
    setIsUserLoggedIn,
    isLoading,
    setIsLoading,
    fetchUser,
    emailVerified,
    setEmailVerified,
    isProfileCreated,
    setIsProfileCreated,
  } = useUserContext();

  // Mock data for dashboard stats - replace with real data
  const [dashboardStats, setDashboardStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    dueTasks: 0,
    totalWorkspaces: 0,
    activeProjects: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (user && user.workspaces) {
      // Calculate stats from user data
      const totalWorkspaces = user.workspaces?.length || 0;

      // Mock calculations - replace with real data fetching
      setDashboardStats({
        totalTasks: 24,
        completedTasks: 18,
        pendingTasks: 6,
        dueTasks: 3,
        totalWorkspaces,
        activeProjects: 8,
      });

      // Mock recent activity
      setRecentActivity([
        {
          id: 1,
          action: "Completed task 'Design Homepage'",
          time: "2 hours ago",
          type: "task",
        },
        {
          id: 2,
          action: "Created new workspace 'Marketing Team'",
          time: "1 day ago",
          type: "workspace",
        },
        {
          id: 3,
          action: "Updated project 'Website Redesign'",
          time: "2 days ago",
          type: "project",
        },
        {
          id: 4,
          action: "Invited 3 members to workspace",
          time: "3 days ago",
          type: "member",
        },
      ]);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <TypeWriterLoader />
      </div>
    );
  }

  if (!isLoading && !isUserLoggedIn) {
    router.replace("/sign-up");
    return;
  }

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2">
              <MdTrendingUp className="text-green-500 text-sm mr-1" />
              <span className="text-green-500 text-sm font-medium">
                {trend}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white text-xl" />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({
    icon: Icon,
    title,
    description,
    onClick,
    color,
  }) => (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-center">
        <div
          className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="text-white text-xl" />
        </div>
        <div className="ml-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {description}
          </p>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getIcon = (type) => {
      switch (type) {
        case "task":
          return <FaTasks className="text-blue-500" />;
        case "workspace":
          return <MdOutlineWork className="text-green-500" />;
        case "project":
          return <MdAssignment className="text-purple-500" />;
        case "member":
          return <MdGroup className="text-orange-500" />;
        default:
          return <MdCheckCircle className="text-gray-500" />;
      }
    };

    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
        <div className="flex-shrink-0">{getIcon(activity.type)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 dark:text-white">
            {activity.action}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {activity.time}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name || "User"}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Here&apos;s what&apos;s happening with your projects today.
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={FaTasks}
          title="Total Tasks"
          value={dashboardStats.totalTasks}
          color="bg-blue-500"
          trend={12}
        />
        <StatCard
          icon={MdCheckCircle}
          title="Completed Tasks"
          value={dashboardStats.completedTasks}
          color="bg-green-500"
          trend={8}
        />
        <StatCard
          icon={MdSchedule}
          title="Pending Tasks"
          value={dashboardStats.pendingTasks}
          color="bg-yellow-500"
        />
        <StatCard
          icon={TbCalendarDue}
          title="Due Tasks"
          value={dashboardStats.dueTasks}
          color="bg-red-500"
        />
        <StatCard
          icon={MdOutlineWork}
          title="Workspaces"
          value={dashboardStats.totalWorkspaces}
          color="bg-purple-500"
        />
        <StatCard
          icon={MdAssignment}
          title="Active Projects"
          value={dashboardStats.activeProjects}
          color="bg-indigo-500"
        />
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionCard
              icon={MdAdd}
              title="Create New Task"
              description="Add a new task to your workspace"
              onClick={() => router.push("/YourTasks")}
              color="bg-thm-clr-1"
            />
            <QuickActionCard
              icon={MdOutlineWork}
              title="New Workspace"
              description="Create a workspace for your team"
              onClick={() => {
                /* Add workspace creation logic */
              }}
              color="bg-green-500"
            />
            <QuickActionCard
              icon={FaTasks}
              title="View All Tasks"
              description="See all your assigned tasks"
              onClick={() => router.push("/YourTasks/AllTasks")}
              color="bg-purple-500"
            />
            <QuickActionCard
              icon={TbCalendarDue}
              title="Due Tasks"
              description="Check tasks that are due soon"
              onClick={() => router.push("/YourTasks/DueTasks")}
              color="bg-orange-500"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4">
              {recentActivity.length > 0 ? (
                <div className="space-y-1">
                  {recentActivity.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MdCheckCircle className="mx-auto text-gray-400 text-4xl mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No recent activity
                  </p>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={() => {
                  /* Add view all activity logic */
                }}
                className="text-thm-clr-1 hover:text-thm-clr-2 text-sm font-medium transition-colors"
              >
                View all activity →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Progress Overview
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Task Completion Rate
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {dashboardStats.completedTasks} of {dashboardStats.totalTasks}{" "}
                tasks completed
              </p>
            </div>
            <span className="text-2xl font-bold text-thm-clr-1">
              {dashboardStats.totalTasks > 0
                ? Math.round(
                    (dashboardStats.completedTasks /
                      dashboardStats.totalTasks) *
                      100
                  )
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-thm-clr-1 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${
                  dashboardStats.totalTasks > 0
                    ? (dashboardStats.completedTasks /
                        dashboardStats.totalTasks) *
                      100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
