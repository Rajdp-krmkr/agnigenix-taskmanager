import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

const ProjectHeader = ({
  project,
  showDetails,
  setShowDetails,
  getStatusColor,
  onAddTask,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold
                ${
                  project?.logo.customized.bg
                    ? `${project.logo.customized.bg}`
                    : "bg-[#black]"
                }
                ${
                  project?.logo.customized.textColor
                    ? `text-[${project.logo.customized.textColor}]`
                    : "text-white"
                }
              `}
            >
              {project?.logo.letter}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {project?.title || "Untitled Project"}
                </h1>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-1.5 ml-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label={showDetails ? "Hide details" : "Show details"}
                >
                  <MdKeyboardArrowDown
                    className={`w-5 h-5 transform transition-transform duration-200 ${
                      showDetails ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  showDetails
                    ? "max-h-96 opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 max-w-xl">
                  {project?.description || "No description available."}
                </p>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                      project?.status?.toLowerCase()?.replace(" ", "-") ||
                        "in-progress"
                    )}`}
                  >
                    {project?.status || "In Progress"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Project ID: {project?.id || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={onAddTask}
            >
              Add Task
            </button>
            <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
