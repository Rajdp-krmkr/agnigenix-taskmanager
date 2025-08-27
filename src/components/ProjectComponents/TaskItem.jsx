import React from "react";
import Image from "next/image";
import { FaCalendarAlt, FaEllipsisV } from "react-icons/fa";

const TaskItem = ({ task, getStatusColor, getPriorityColor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-md font-medium text-gray-900 dark:text-white">
              {task?.title || "Untitled Task"}
            </h3>
            <span
              className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(
                task?.status || "todo"
              )}`}
            >
              {task?.status?.replace("-", " ") || "Todo"}
            </span>
            <span
              className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityColor(
                task?.priority || "medium"
              )}`}
            >
              {task?.priority || "Medium"}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {task?.description || "No description available."}
          </p>
          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <FaCalendarAlt className="w-3 h-3" />
              <span>
                Due:{" "}
                {task?.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "Not set"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Image
                src="/icons/github-mark.png"
                alt={task?.assignee?.name || "Unassigned"}
                width={16}
                height={16}
                className="rounded-full"
              />
              <span>{task?.assignee?.name || "Unassigned"}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {task?.labels?.length > 0 ? (
              task.labels.map((label) => (
                <span
                  key={label}
                  className="inline-flex px-1.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  {label}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">No labels</span>
            )}
          </div>
        </div>
        <div className="ml-3">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <FaEllipsisV className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
