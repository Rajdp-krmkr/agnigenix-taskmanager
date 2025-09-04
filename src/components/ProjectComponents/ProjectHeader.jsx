import React from "react";
import { MdKeyboardArrowDown, MdSettings } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

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
        {/* Mobile and Desktop Layout */}
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-start lg:justify-between">
          {/* Left Section - Project Info */}
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            {/* Project Logo */}
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0
                ${
                  project?.logo.customized.bg
                    ? `${project.logo.customized.bg}`
                    : "bg-black"
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

            {/* Project Details */}
            <div className="flex-1 min-w-0">
              {/* Title and Toggle Button */}
              <div className="flex items-center justify-between mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate pr-2">
                  {project?.title || "Untitled Project"}
                </h1>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
                  aria-label={showDetails ? "Hide details" : "Show details"}
                >
                  <MdKeyboardArrowDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 transform transition-transform duration-200 ${
                      showDetails ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Expandable Details */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  showDetails
                    ? "max-h-96 opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 break-words">
                  {project?.description || "No description available."}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border self-start ${getStatusColor(
                      project?.status?.toLowerCase()?.replace(" ", "-") ||
                        "in-progress"
                    )}`}
                  >
                    {project?.status || "In Progress"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 break-all">
                    Project ID: {project?.id || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex justify-end space-x-2 flex-shrink-0 lg:ml-4">
            {/* Add Task Button */}
            <button
              className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              onClick={onAddTask}
            >
              <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Add Task</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Settings Button */}
            <button className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
              <MdSettings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
