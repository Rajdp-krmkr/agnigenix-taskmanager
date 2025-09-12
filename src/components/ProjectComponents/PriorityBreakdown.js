import { getPriorityBreakdown } from "@/lib/utils/getPriorityBreakdown";
import React, { useMemo } from "react";
import {
  FaExclamationTriangle,
  FaFlag,
  FaCheckCircle,
  FaChartPie,
} from "react-icons/fa";

const PriorityBreakdown = ({ projectTasks = [], isLoading = false }) => {
  const priorityData = useMemo(() => {
    if (!projectTasks?.length) return null;

    const breakdown = getPriorityBreakdown(projectTasks);
    const total = breakdown.low + breakdown.medium + breakdown.high;

    if (total === 0) return null;

    // Calculate percentages
    const percentages = {
      high: ((breakdown.high / total) * 100).toFixed(1),
      medium: ((breakdown.medium / total) * 100).toFixed(1),
      low: ((breakdown.low / total) * 100).toFixed(1),
    };

    // Create data for visualization
    const priorityItems = [
      {
        name: "High Priority",
        count: breakdown.high,
        percentage: percentages.high,
        color: "red",
        icon: FaExclamationTriangle,
        bgColor: "bg-red-500",
        lightBg: "bg-red-100 dark:bg-red-900/20",
        textColor: "text-red-600",
        description: "Urgent tasks requiring immediate attention",
      },
      {
        name: "Medium Priority",
        count: breakdown.medium,
        percentage: percentages.medium,
        color: "yellow",
        icon: FaFlag,
        bgColor: "bg-yellow-500",
        lightBg: "bg-yellow-100 dark:bg-yellow-900/20",
        textColor: "text-yellow-600",
        description: "Important tasks with moderate urgency",
      },
      {
        name: "Low Priority",
        count: breakdown.low,
        percentage: percentages.low,
        color: "green",
        icon: FaCheckCircle,
        bgColor: "bg-green-500",
        lightBg: "bg-green-100 dark:bg-green-900/20",
        textColor: "text-green-600",
        description: "Tasks that can be completed when time allows",
      },
    ];

    return {
      breakdown,
      total,
      percentages,
      priorityItems: priorityItems.filter((item) => item.count > 0),
    };
  }, [projectTasks]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div>
            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Loading chart skeleton */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!priorityData || priorityData.total === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-transparent transition-all hover:dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <FaChartPie className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Priority Breakdown
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Distribution of tasks by priority
            </p>
          </div>
        </div>

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaChartPie className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
            No tasks available
          </h4>
          <p className="text-gray-500 dark:text-gray-500">
            Add tasks to see priority distribution
          </p>
        </div>
      </div>
    );
  }

  const { total, priorityItems } = priorityData;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm  border border-transparent transition-all hover:dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <FaChartPie className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Priority Breakdown
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Distribution of tasks by priority
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Total Tasks
          </div>
        </div>
      </div>

      {/* Priority Bar Chart */}
      <div className="mb-6">
        <div className="flex rounded-lg overflow-hidden h-3 bg-gray-200 dark:bg-gray-700">
          {priorityItems.map((item, index) => (
            <div
              key={index}
              className={`${item.bgColor} transition-all duration-300 hover:opacity-80`}
              style={{ width: `${item.percentage}%` }}
              title={`${item.name}: ${item.count} tasks (${item.percentage}%)`}
            />
          ))}
        </div>
      </div>

      {/* Priority Items */}
      <div className="space-y-4">
        {priorityItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className={`${item.lightBg} rounded-lg p-4 transition-all duration-200 hover:shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${item.bgColor} rounded-lg`}>
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4
                      className={`font-semibold ${item.textColor} dark:text-gray-200`}
                    >
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xl font-bold ${item.textColor} dark:text-gray-200`}
                  >
                    {item.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {item.percentage}%
                  </div>
                </div>
              </div>

              {/* Progress bar for individual priority */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>
                    {item.count} of {total} tasks
                  </span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`${item.bgColor} h-2 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-red-600 dark:text-red-400">
              {((priorityData.breakdown.high / total) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              High Priority
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {((priorityData.breakdown.medium / total) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Medium Priority
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {((priorityData.breakdown.low / total) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Low Priority
            </div>
          </div>
        </div>

        {/* Priority recommendation */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <FaChartPie className="w-4 h-4" />
            <span className="font-medium">
              {priorityData.breakdown.high > total * 0.5
                ? "⚠️ High priority tasks dominate - consider delegation or timeline adjustment"
                : priorityData.breakdown.low > total * 0.7
                ? "✅ Good balance - most tasks are manageable priority"
                : "📊 Balanced priority distribution across tasks"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriorityBreakdown;
