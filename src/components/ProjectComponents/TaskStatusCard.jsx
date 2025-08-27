import React from "react";
import { MdTask, MdCheckCircle } from "react-icons/md";
import { FaHourglassHalf } from "react-icons/fa";

const TaskStatusCard = ({ project }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 lg:col-span-3">
      <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
        Task Status
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {/* Total Tasks */}
        <div className="border dark:border-gray-700 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <MdTask className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              Total Tasks
            </p>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {project?.tasks?.length || 0}
          </p>
        </div>

        {/* Completed Tasks */}
        <div className="border dark:border-gray-700 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded-lg">
              <MdCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              Completed
            </p>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {project?.tasks?.filter((task) => task?.status === "completed")?.length || 0}
          </p>
        </div>

        {/* In Progress Tasks */}
        <div className="border dark:border-gray-700 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <FaHourglassHalf className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400">
              In Progress
            </p>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {
              project?.tasks?.filter((task) => task?.status === "in-progress")
                ?.length || 0
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default TaskStatusCard;
