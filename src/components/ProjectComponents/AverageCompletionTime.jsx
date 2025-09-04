import { getAverageCompletionTime } from "@/lib/utils/getAverageCompletionTime";
import React, { useMemo } from "react";
import {
  FaClock,
  FaStopwatch,
  FaChartLine,
  FaTrophy,
  FaCalendarCheck,
} from "react-icons/fa";

const AverageCompletionTime = ({ projectTasks = [], isLoading = false }) => {
  const completionData = useMemo(() => {
    if (!projectTasks?.length) return null;

    // Get overall average completion time
    const avgHours = getAverageCompletionTime(projectTasks);

    // Calculate completion stats by priority
    const priorityStats = {
      high: [],
      medium: [],
      low: [],
    };

    let totalCompletedTasks = 0;
    let totalCompletionTime = 0;

    projectTasks.forEach((task) => {
      if (task.status === "done" && task.completedAt && task.createdAt) {
        const start = new Date(task.createdAt).getTime();
        const end = new Date(task.completedAt).getTime();
        const timeInHours = (end - start) / (1000 * 60 * 60);

        totalCompletedTasks++;
        totalCompletionTime += timeInHours;

        if (task.priority && priorityStats[task.priority]) {
          priorityStats[task.priority].push(timeInHours);
        }
      }
    });

    // Calculate average for each priority
    const priorityAverages = Object.entries(priorityStats)
      .map(([priority, times]) => {
        const avg =
          times.length > 0
            ? times.reduce((sum, time) => sum + time, 0) / times.length
            : 0;
        const count = times.length;
        return { priority, avg, count };
      })
      .filter((item) => item.count > 0);

    // Calculate fastest and slowest tasks
    const completedTaskTimes = projectTasks
      .filter(
        (task) => task.status === "done" && task.completedAt && task.createdAt
      )
      .map((task) => {
        const start = new Date(task.createdAt).getTime();
        const end = new Date(task.completedAt).getTime();
        return {
          ...task,
          completionTime: (end - start) / (1000 * 60 * 60),
        };
      })
      .sort((a, b) => a.completionTime - b.completionTime);

    const fastestTask = completedTaskTimes[0];
    const slowestTask = completedTaskTimes[completedTaskTimes.length - 1];

    // Performance category
    let performanceCategory = "good";
    if (avgHours < 24) performanceCategory = "excellent";
    else if (avgHours < 72) performanceCategory = "good";
    else if (avgHours < 168) performanceCategory = "average";
    else performanceCategory = "needs_improvement";

    return {
      avgHours,
      totalCompletedTasks,
      priorityAverages,
      fastestTask,
      slowestTask,
      performanceCategory,
      avgDays: avgHours / 24,
      medianTime:
        completedTaskTimes.length > 0
          ? completedTaskTimes[Math.floor(completedTaskTimes.length / 2)]
              ?.completionTime
          : 0,
    };
  }, [projectTasks]);

  const formatTime = (hours) => {
    if (hours === 0) return "0h";

    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    const minutes = Math.floor((hours % 1) * 60);

    if (days > 0) {
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    } else if (remainingHours > 0) {
      return minutes > 0
        ? `${remainingHours}h ${minutes}m`
        : `${remainingHours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return {
          icon: FaTrophy,
          color: "text-red-500",
          bg: "bg-red-100 dark:bg-red-900/20",
        };
      case "medium":
        return {
          icon: FaStopwatch,
          color: "text-yellow-500",
          bg: "bg-yellow-100 dark:bg-yellow-900/20",
        };
      case "low":
        return {
          icon: FaCalendarCheck,
          color: "text-green-500",
          bg: "bg-green-100 dark:bg-green-900/20",
        };
      default:
        return {
          icon: FaClock,
          color: "text-gray-500",
          bg: "bg-gray-100 dark:bg-gray-900/20",
        };
    }
  };

  const getPerformanceColor = (category) => {
    switch (category) {
      case "excellent":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case "good":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
      case "average":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
      case "needs_improvement":
        return "text-red-600 bg-red-50 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getPerformanceText = (category) => {
    switch (category) {
      case "excellent":
        return "🚀 Excellent Performance";
      case "good":
        return "✅ Good Performance";
      case "average":
        return "⚡ Average Performance";
      case "needs_improvement":
        return "🎯 Room for Improvement";
      default:
        return "Performance Analysis";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div>
            <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-2"></div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!completionData || completionData.totalCompletedTasks === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
            <FaClock className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Average Completion Time
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Task completion analysis
            </p>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaClock className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            No completed tasks
          </h4>
          <p className="text-gray-500 dark:text-gray-500">
            Complete some tasks to see completion time analysis
          </p>
        </div>
      </div>
    );
  }

  const {
    avgHours,
    totalCompletedTasks,
    priorityAverages,
    fastestTask,
    slowestTask,
    performanceCategory,
    avgDays,
    medianTime,
  } = completionData;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
            <FaClock className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Average Completion Time
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Based on {totalCompletedTasks} completed tasks
            </p>
          </div>
        </div>

        <div
          className={`px-3 py-1 rounded-full ${getPerformanceColor(
            performanceCategory
          )}`}
        >
          <span className="text-sm font-medium">
            {getPerformanceText(performanceCategory)}
          </span>
        </div>
      </div>

      {/* Main Statistics */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          {formatTime(avgHours)}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Average completion time ({avgDays.toFixed(1)} days)
        </p>
      </div>

      {/* Priority Breakdown */}
      {priorityAverages.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Completion Time by Priority
          </h4>
          <div className="space-y-3">
            {priorityAverages.map((item, index) => {
              const priorityInfo = getPriorityIcon(item.priority);
              const IconComponent = priorityInfo.icon;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 ${priorityInfo.bg} rounded-lg`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-full ${priorityInfo.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {item.priority} Priority
                      </span>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {item.count} tasks completed
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {formatTime(item.avg)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {fastestTask ? formatTime(fastestTask.completionTime) : "N/A"}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Fastest Task
          </div>
          {fastestTask && (
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
              &ldquo;{fastestTask.title}&rdquo;
            </div>
          )}
        </div>

        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {formatTime(medianTime)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            Median Time
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Middle completion time
          </div>
        </div>
      </div>

      {/* Insights */}
      <div
        className={`p-4 rounded-lg ${getPerformanceColor(performanceCategory)}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <FaChartLine className="w-4 h-4" />
          <span className="font-medium">Performance Insights</span>
        </div>
        <div className="text-sm">
          {avgHours < 24 && (
            <p>🚀 Excellent! Tasks are completed within a day on average.</p>
          )}
          {avgHours >= 24 && avgHours < 72 && (
            <p>✅ Good pace! Most tasks are completed within 2-3 days.</p>
          )}
          {avgHours >= 72 && avgHours < 168 && (
            <p>
              ⚡ Tasks typically take 3-7 days to complete. Consider breaking
              down complex tasks.
            </p>
          )}
          {avgHours >= 168 && (
            <p>
              🎯 Tasks take over a week on average. Consider reviewing task
              complexity and resource allocation.
            </p>
          )}

          {slowestTask && (
            <p className="mt-2 text-xs">
              💡 Longest task: &ldquo;{slowestTask.title}&rdquo; took{" "}
              {formatTime(slowestTask.completionTime)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AverageCompletionTime;
