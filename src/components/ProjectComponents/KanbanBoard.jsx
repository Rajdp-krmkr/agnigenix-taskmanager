import React, { useState } from "react";
import Image from "next/image";
import { FaPlus, FaEllipsisV } from "react-icons/fa";

const KanbanBoard = ({ project }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);

  // Kanban columns
  const columns = [
    { id: "todo", title: "To Do", color: "bg-gray-100 dark:bg-gray-700" },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-blue-100 dark:bg-blue-900",
    },
    {
      id: "review",
      title: "Review",
      color: "bg-yellow-100 dark:bg-yellow-900",
    },
    {
      id: "completed",
      title: "Completed",
      color: "bg-green-100 dark:bg-green-900",
    },
  ];

  // Group tasks by status
  const groupedTasks = React.useMemo(() => {
    // Map task statuses to kanban columns
    const statusMapping = {
      todo: "todo",
      "in progress": "in-progress",
      "in-progress": "in-progress",
      review: "review",
      testing: "review",
      completed: "completed",
      done: "completed",
    };

    const groups = {
      todo: [],
      "in-progress": [],
      review: [],
      completed: [],
    };

    project?.tasks?.forEach((task) => {
      const status = task.status?.toLowerCase() || "todo";
      const column = statusMapping[status] || "todo";
      groups[column].push(task);
    });

    return groups;
  }, [project?.tasks]);

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, columnId) => {
    e.preventDefault();
    setDraggedOver(columnId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.relatedTarget?.closest(`[data-column="${draggedOver}"]`)) {
      setDraggedOver(null);
    }
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    setDraggedOver(null);

    if (draggedTask) {
      // Here you would typically update the task status in your database
      console.log(`Moving task ${draggedTask.id} to ${targetColumn}`);
      // For now, we'll just log the action
      // You can implement the actual update logic here
    }

    setDraggedTask(null);
  };

  // Task card component
  const TaskCard = ({ task }) => {
    const getPriorityColor = (priority) => {
      switch (priority?.toLowerCase()) {
        case "high":
          return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
        case "medium":
          return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
        case "low":
          return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
        default:
          return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      }
    };

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-4 mb-3 cursor-move hover:shadow-md transition-shadow ${
          draggedTask?.id === task.id ? "opacity-50" : ""
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
            {task.title}
          </h4>
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <FaEllipsisV size={12} />
          </button>
        </div>

        {task.description && (
          <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {task.priority && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            )}
            {task.labels?.map((label, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs"
              >
                {label}
              </span>
            ))}
          </div>

          {task.assignee && (
            <div className="flex items-center space-x-1">
              <Image
                src={task.assignee.avatar || "/public/icons/github-mark.png"}
                alt={task.assignee.name}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
              />
            </div>
          )}
        </div>

        {task.dueDate && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Due: {task.dueDate}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Kanban Board
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Drag and drop tasks to update their status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            data-column={column.id}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`${
              column.color
            } rounded-lg p-4 min-h-[500px] transition-all duration-200 ${
              draggedOver === column.id
                ? "ring-2 ring-blue-400 bg-opacity-50"
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {column.title}
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({groupedTasks[column.id]?.length || 0})
                </span>
              </h3>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded">
                <FaPlus size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {groupedTasks[column.id]?.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}

              {groupedTasks[column.id]?.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No tasks in this column</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
