import React, { useState, useEffect, useMemo, memo } from "react";
import Image from "next/image";
import {
  FaUser,
  FaBalanceScale,
  FaExclamationTriangle,
  FaChartBar,
} from "react-icons/fa";
import { MdTrendingUp, MdTrendingDown, MdTrendingFlat } from "react-icons/md";
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

// Import the workload function
function getWorkload(tasks) {
  let workload = {};

  tasks.forEach((t) => {
    if (!workload[t.assignedTo])
      workload[t.assignedTo] = { low: 0, medium: 0, high: 0 };
    workload[t.assignedTo][t.priority]++;
  });

  return workload;
}

const WorkloadBalanceCard = memo(
  ({ projectTasks, projectMembers, isLoading, overviewViewMode }) => {
    const [workloadData, setWorkloadData] = useState({});

    // Calculate workload data
    const calculatedWorkload = useMemo(() => {
      if (!projectTasks || projectTasks.length === 0) return {};
      return getWorkload(projectTasks);
    }, [projectTasks]);

    // Memoize chart data calculation
    const chartData = useMemo(() => {
      if (!projectMembers || !projectTasks) return [];

      return projectMembers
        .map((member) => {
          const memberTasks = projectTasks.filter(
            (task) => task.assignee?.uid === member.uid
          );
          const completedTasks = memberTasks.filter(
            (task) => task.status === "completed"
          ).length;
          const inProgressTasks = memberTasks.filter(
            (task) => task.status === "in-progress"
          ).length;
          const todoTasks = memberTasks.filter(
            (task) => task.status === "todo"
          ).length;

          return {
            name:
              member.displayName || member.email?.split("@")[0] || "Unknown",
            completed: completedTasks,
            inProgress: inProgressTasks,
            todo: todoTasks,
          };
        })
        .filter(
          (member) => member.completed + member.inProgress + member.todo > 0
        );
    }, [projectMembers, projectTasks]);

    // Memoize sorted workload data

    useEffect(() => {
      setWorkloadData(calculatedWorkload);
    }, [calculatedWorkload]);

    const getMemberInfo = useMemo(() => {
      return (memberId) => {
        return (
          projectMembers?.find((member) => member.uid === memberId) || {
            displayName: "Unknown User",
            photoURL: null,
            uid: memberId,
          }
        );
      };
    }, [projectMembers]);

    const calculateTotalTasks = (workload) => {
      return (
        (workload.low || 0) + (workload.medium || 0) + (workload.high || 0)
      );
    };

    const sortedWorkload = useMemo(() => {
      return Object.entries(workloadData).sort(
        ([, a], [, b]) => calculateTotalTasks(b) - calculateTotalTasks(a)
      );
    }, [workloadData]);

    const getWorkloadLevel = (totalTasks) => {
      if (totalTasks >= 8)
        return {
          level: "high",
          color: "text-red-600 dark:text-red-400",
          icon: MdTrendingUp,
        };
      if (totalTasks >= 4)
        return {
          level: "medium",
          color: "text-yellow-600 dark:text-yellow-400",
          icon: MdTrendingFlat,
        };
      return {
        level: "low",
        color: "text-green-600 dark:text-green-400",
        icon: MdTrendingDown,
      };
    };

    const getPriorityColor = (priority) => {
      switch (priority) {
        case "high":
          return "bg-red-500";
        case "medium":
          return "bg-yellow-500";
        case "low":
          return "bg-green-500";
        default:
          return "bg-gray-500";
      }
    };

    if (isLoading) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded mr-2"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1 w-20"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((bar) => (
                      <div
                        key={bar}
                        className="w-3 h-8 bg-gray-200 dark:bg-gray-700 rounded"
                      ></div>
                    ))}
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
            <FaChartBar className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">
              Member Workload Balance
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
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="completed"
                    stackId="a"
                    fill="#10b981"
                    name="Completed"
                  />
                  <Bar
                    dataKey="inProgress"
                    stackId="a"
                    fill="#f59e0b"
                    name="In Progress"
                  />
                  <Bar dataKey="todo" stackId="a" fill="#ef4444" name="To Do" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white h-full dark:bg-gray-800 p-4 rounded-lg shadow-sm border transition-all border-transparent hover:dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaBalanceScale className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">
              Workload Balance
            </h3>
          </div>
          {sortedWorkload.length > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {sortedWorkload.length} member
              {sortedWorkload.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {sortedWorkload.length > 0 ? (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {sortedWorkload.map(([memberId, workload]) => {
              const member = getMemberInfo(memberId);
              const totalTasks = calculateTotalTasks(workload);
              const workloadLevel = getWorkloadLevel(totalTasks);
              const WorkloadIcon = workloadLevel.icon;

              return (
                <div
                  key={memberId}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {/* Member Avatar */}
                    <div className="relative">
                      {member.photoURL ? (
                        <Image
                          src={member.photoURL}
                          alt={member.displayName}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <FaUser className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Member Info */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.displayName}
                      </p>
                      <div className="flex items-center space-x-1">
                        <WorkloadIcon
                          className={`w-3 h-3 ${workloadLevel.color}`}
                        />
                        <span
                          className={`text-xs font-medium ${workloadLevel.color}`}
                        >
                          {totalTasks} task{totalTasks !== 1 ? "s" : ""} •{" "}
                          {workloadLevel.level} load
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Workload Visualization */}
                  <div className="flex items-end space-x-1">
                    {/* High Priority Bar */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 rounded-sm ${getPriorityColor(
                          "high"
                        )} transition-all duration-300`}
                        style={{
                          height: `${Math.max((workload.high || 0) * 4, 4)}px`,
                        }}
                        title={`${workload.high || 0} high priority tasks`}
                      ></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        H
                      </span>
                    </div>

                    {/* Medium Priority Bar */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 rounded-sm ${getPriorityColor(
                          "medium"
                        )} transition-all duration-300`}
                        style={{
                          height: `${Math.max(
                            (workload.medium || 0) * 4,
                            4
                          )}px`,
                        }}
                        title={`${workload.medium || 0} medium priority tasks`}
                      ></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        M
                      </span>
                    </div>

                    {/* Low Priority Bar */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 rounded-sm ${getPriorityColor(
                          "low"
                        )} transition-all duration-300`}
                        style={{
                          height: `${Math.max((workload.low || 0) * 4, 4)}px`,
                        }}
                        title={`${workload.low || 0} low priority tasks`}
                      ></div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        L
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FaBalanceScale className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No workload data available</p>
            <p className="text-xs">Assign tasks to see workload distribution</p>
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

  // Deep comparison for tasks - check if task IDs and status have changed
  if (prevProps.projectTasks && nextProps.projectTasks) {
    for (let i = 0; i < prevProps.projectTasks.length; i++) {
      const prevTask = prevProps.projectTasks[i];
      const nextTask = nextProps.projectTasks[i];
      if (
        prevTask?.id !== nextTask?.id ||
        prevTask?.status !== nextTask?.status ||
        prevTask?.priority !== nextTask?.priority ||
        prevTask?.assignee?.uid !== nextTask?.assignee?.uid
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

WorkloadBalanceCard.displayName = "WorkloadBalanceCard";

export default memo(WorkloadBalanceCard, arePropsEqual);
