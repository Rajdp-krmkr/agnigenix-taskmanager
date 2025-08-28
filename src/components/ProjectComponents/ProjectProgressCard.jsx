import React from "react";

const ProjectProgressCard = ({ project, getPriorityColor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 lg:col-span-2">
      <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
        Project Progress
      </h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          Overall Progress
        </span>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {project?.progress || 0}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${project?.progress || 0}%` }}
        ></div>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="text-center">
          <p className="font-medium text-gray-900 dark:text-white">
            Start Date
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {project?.deadlines.start_date
              ? new Date(project.deadlines.start_date).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div className="text-center">
          <p className="font-medium text-gray-900 dark:text-white">Due Date</p>
          <p className="text-gray-600 dark:text-gray-400">
            {project?.deadlines.end_date
              ? new Date(project.deadlines.end_date).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
        <div className="text-center">
          <p className="font-medium text-gray-900 dark:text-white">Priority</p>
          <span
            className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(
              project?.priority?.toLowerCase() || "medium"
            )}`}
          >
            {project?.priority || "Medium"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressCard;
