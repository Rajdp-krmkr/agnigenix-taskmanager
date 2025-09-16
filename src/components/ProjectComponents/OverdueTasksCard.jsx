import React, { useState, useEffect, useMemo, memo } from "react";
import { getOverdueTasks } from "@/lib/utils/getOverdueTasks";
import {
  FaExclamationTriangle,
  FaClock,
  FaUser,
  FaChartBar,
} from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Image from "next/image";

const OverdueTasksCard = memo(
  ({ projectTasks, projectMembers, isLoading, overviewViewMode }) => {
    const [overdueTasks, setOverdueTasks] = useState([]);

    // Memoize overdue tasks calculation
    const overdueTasksData = useMemo(() => {
      if (!projectTasks || projectTasks.length === 0) return [];
      return getOverdueTasks(projectTasks);
    }, [projectTasks]);

    // Memoize chart data calculation
    const chartData = useMemo(() => {
      if (!projectTasks) return [];

      const overdueByPriority = projectTasks
        .filter((task) => {
          const dueDate = task.dueDate?.toDate?.() || new Date(task.dueDate);
          return dueDate < new Date() && task.status !== "completed";
        })
        .reduce((acc, task) => {
          const priority = task.priority || "low";
          acc[priority] = (acc[priority] || 0) + 1;
          return acc;
        }, {});

      return [
        {
          priority: "High",
          count: overdueByPriority.high || 0,
          fill: "#ef4444",
        },
        {
          priority: "Medium",
          count: overdueByPriority.medium || 0,
          fill: "#f59e0b",
        },
        {
          priority: "Low",
          count: overdueByPriority.low || 0,
          fill: "#10b981",
        },
      ].filter((item) => item.count > 0);
    }, [projectTasks]);

    useEffect(() => {
      setOverdueTasks(overdueTasksData);
    }, [overdueTasksData]);

    // Memoize getMemberInfo function
    const getMemberInfo = useMemo(() => {
      return (memberId) => {
        return (
          projectMembers?.find((member) => member.uid === memberId) || {
            displayName: "Unassigned",
            photoURL: null,
            uid: memberId,
          }
        );
      };
    }, [projectMembers]);

    // Memoize utility functions
    const getDaysOverdue = useMemo(() => {
      return (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = now - due;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      };
    }, []);

    const formatDueDate = useMemo(() => {
      return (dueDate) => {
        return new Date(dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      };
    }, []);

    // Pure function for priority colors (doesn't need memoization)
    const getPriorityColor = (priority) => {
      switch (priority?.toLowerCase()) {
        case "high":
          return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
        case "medium":
          return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
        case "low":
          return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
      }
    };

    if (isLoading) {
      return (
        <div className="bg-white dark:bg-gray-800  p-4 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
                      <div className="flex items-center space-x-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (overviewViewMode === "charts") {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="flex items-center mb-4">
            <FaChartBar className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">
              Overdue Tasks by Priority
            </h3>
          </div>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="priority" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#ef4444" name="Overdue Tasks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white h-full dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-transparent transition-all hover:dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">
              Overdue Tasks
            </h3>
          </div>
          {overdueTasks.length > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              {overdueTasks.length} overdue
            </span>
          )}
        </div>

        {overdueTasks.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {overdueTasks.slice(0, 5).map((task) => {
              const member = getMemberInfo(task.assignedTo);
              const daysOverdue = getDaysOverdue(task.dueDate);

              return (
                <div
                  key={task.id}
                  className={`p-3 bg-red-50 dark:bg-red-500/20 rounded-lg border border-red-200 dark:border-red-500/30 ${
                    task.priority == "high" &&
                    "animate-pulse dark:bg-red-500/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-2">
                        <MdAssignment className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {task.title}
                          </h4>
                          <div className="flex items-center space-x-3 mt-1">
                            <div className="flex items-center text-xs text-red-600 dark:text-red-400">
                              <FaClock className="w-3 h-3 mr-1" />
                              {daysOverdue} day{daysOverdue !== 1 ? "s" : ""}{" "}
                              overdue
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Due: {formatDueDate(task.dueDate)}
                            </span>
                            {task.priority && (
                              <span
                                className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded border ${getPriorityColor(
                                  task.priority
                                )}`}
                              >
                                {task.priority}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Assignee Avatar */}
                    <div className="flex-shrink-0 ml-3">
                      {member.photoURL ? (
                        <div className="flex items-center space-x-2">
                          <Image
                            src={member.photoURL}
                            alt={member.displayName}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-[12px]">{member.name}</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                          <FaUser className="w-3 h-3 text-white" />
                          <span className="sr-only">{member.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {overdueTasks.length > 5 && (
              <div className="text-center py-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{overdueTasks.length - 5} more overdue tasks
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FaClock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No overdue tasks</p>
            <p className="text-xs">Great job staying on track!</p>
          </div>
        )}
      </div>
    );
  }
);

// Custom comparison function for React.memo
const arePropsEqual = (prevProps, nextProps) => {
  // Quick equality checks first
  if (
    prevProps.isLoading !== nextProps.isLoading ||
    prevProps.overviewViewMode !== nextProps.overviewViewMode ||
    prevProps.projectTasks?.length !== nextProps.projectTasks?.length ||
    prevProps.projectMembers?.length !== nextProps.projectMembers?.length
  ) {
    return false;
  }

  // If arrays are empty or undefined, they're equal
  if (!prevProps.projectTasks && !nextProps.projectTasks) return true;
  if (!prevProps.projectMembers && !nextProps.projectMembers) return true;

  // Deep comparison for tasks - check if task IDs, status, and due dates have changed
  if (prevProps.projectTasks && nextProps.projectTasks) {
    for (let i = 0; i < prevProps.projectTasks.length; i++) {
      const prevTask = prevProps.projectTasks[i];
      const nextTask = nextProps.projectTasks[i];
      if (
        prevTask?.id !== nextTask?.id ||
        prevTask?.status !== nextTask?.status ||
        prevTask?.priority !== nextTask?.priority ||
        prevTask?.dueDate !== nextTask?.dueDate ||
        prevTask?.assignedTo !== nextTask?.assignedTo
      ) {
        return false;
      }
    }
  }

  // Deep comparison for members - check if member UIDs have changed
  if (prevProps.projectMembers && nextProps.projectMembers) {
    for (let i = 0; i < prevProps.projectMembers.length; i++) {
      const prevMember = prevProps.projectMembers[i];
      const nextMember = nextProps.projectMembers[i];
      if (prevMember?.uid !== nextMember?.uid) {
        return false;
      }
    }
  }

  return true;
};

OverdueTasksCard.displayName = "OverdueTasksCard";

export default memo(OverdueTasksCard, arePropsEqual);
