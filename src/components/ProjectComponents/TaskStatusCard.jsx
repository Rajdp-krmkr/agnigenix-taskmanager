import React from "react";
import { MdTask, MdCheckCircle } from "react-icons/md";
import { FaHourglassHalf } from "react-icons/fa";

const TaskStatusCard = ({ taskProgress, isLoading }) => {
  // Create array of task status data
  const taskStatusData = [
    {
      id: "total",
      title: "Total Tasks",
      value:
        (taskProgress?.todo || 0) +
        (taskProgress?.inProgress || 0) +
        (taskProgress?.done || 0),
      icon: MdTask,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "completed",
      title: "Completed",
      value: taskProgress?.done || 0,
      icon: MdCheckCircle,
      bgColor: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      id: "inProgress",
      title: "In Progress",
      value: taskProgress?.inProgress || 0,
      icon: FaHourglassHalf,
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 lg:col-span-3">
      <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
        Task Status
      </h3>
      {isLoading ? (
        <div className="animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Loading skeleton for each card */}
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="border dark:border-gray-700 rounded-lg p-3"
              >
                <div className="flex items-center mb-2">
                  {/* Icon skeleton */}
                  <div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg w-8 h-8"></div>
                  {/* Text skeleton */}
                  <div className="ml-2 h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                {/* Number skeleton */}
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {taskStatusData.map((status) => {
            const IconComponent = status.icon;
            return (
              <div
                key={status.id}
                className="border dark:border-gray-700 flex flex-col sm:flex-row sm:justify-between rounded-lg p-3 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-row items-center sm:items-end mb-2 sm:mb-0">
                  <p className="font-bold text-gray-900 dark:text-white text-3xl sm:text-4xl lg:text-5xl">
                    {status.value}
                  </p>
                  <p className="ml-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 self-end">
                    {status.title}
                  </p>
                </div>
                <div className="flex items-start justify-end sm:justify-start">
                  <div className={`p-1.5 ${status.bgColor} rounded-lg`}>
                    <IconComponent
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${status.iconColor}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskStatusCard;
