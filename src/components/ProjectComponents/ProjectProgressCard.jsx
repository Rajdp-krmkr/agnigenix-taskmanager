import { getCompletionPercentage } from "@/lib/utils/ProjectAnalytics";
import React from "react";

const ProjectProgressCard = ({
  project,
  getPriorityColor,
  isLoading,
  taskProgress,
  overviewViewMode
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700 lg:col-span-2">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-28 sm:w-32"></div>

          {/* Progress label skeleton */}
          <div className="flex items-center justify-between mb-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 sm:w-24"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-6 sm:w-8"></div>
          </div>

          {/* Progress bar skeleton */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4"></div>

          {/* Grid items skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="text-center">
                <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded mb-1 w-12 sm:w-16 mx-auto"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 sm:w-20 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  let completionPercentage;

  if (!isLoading) {
    completionPercentage = getCompletionPercentage(taskProgress);
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-transparent transition-all hover:dark:border-gray-700 lg:col-span-2 hover:shadow-md duration-200">
      <h3 className="text-sm sm:text-md font-semibold text-gray-900 dark:text-white mb-3">
        Project Progress
      </h3>

      {/* Progress Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Overall Progress
          </span>
          <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
            {completionPercentage || 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage || 0}%` }}
          ></div>
        </div>
      </div>

      {/* Project Details Grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
        <div className="text-center  p-2 sm:p-0">
          <p className="font-medium text-gray-900 dark:text-white mb-1">
            Start Date
          </p>
          <p className="text-gray-600 dark:text-gray-400 break-words">
            {project?.deadlines.start_date
              ? new Date(project.deadlines.start_date).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )
              : "Not set"}
          </p>
        </div>

        <div className="text-center  p-2 sm:p-0">
          <p className="font-medium text-gray-900 dark:text-white mb-1">
            Due Date
          </p>
          <p className="text-gray-600 dark:text-gray-400 break-words">
            {project?.deadlines.end_date
              ? new Date(project.deadlines.end_date).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )
              : "Not set"}
          </p>
        </div>

        <div className="text-center  p-2 sm:p-0 ">
          <p className="font-medium text-gray-900 dark:text-white mb-1">
            Priority
          </p>
          <div className="flex justify-center">
            <span
              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                project?.priority?.toLowerCase() || "medium"
              )}`}
            >
              {project?.priority || "Medium"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressCard;
