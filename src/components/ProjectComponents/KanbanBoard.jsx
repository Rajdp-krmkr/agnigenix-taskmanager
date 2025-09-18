import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import { IoMdWarning } from "react-icons/io";
import { updateTaskStatus } from "../../Firebase Functions/updateTaskStatus";

// Utility function to format date
const formatDate = (dateString) => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const diffTime = taskDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Format the date
    const options = {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    };
    const formattedDate = date.toLocaleDateString("en-US", options);

    // Add relative time indicators
    if (diffDays === 0) {
      return `Today (${formattedDate})`;
    } else if (diffDays === 1) {
      return `Tomorrow (${formattedDate})`;
    } else if (diffDays === -1) {
      return `Yesterday (${formattedDate})`;
    } else if (diffDays < 0) {
      return `${Math.abs(diffDays)} days ago (${formattedDate})`;
    } else if (diffDays <= 7) {
      return `In ${diffDays} days (${formattedDate})`;
    } else {
      return formattedDate;
    }
  } catch (error) {
    // Fallback for invalid dates
    return dateString;
  }
};

const KanbanBoard = ({ project, projectTasks }) => {
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedOver, setDraggedOver] = useState(null);
  const [lastMoved, setLastMoved] = useState(null);
  const [updatingTasks, setUpdatingTasks] = useState(new Set()); // Track tasks being updated

  // Demo tasks for when project has no tasks
  const initialDemoTasks = [
    {
      id: "demo-1",
      title: "Set up project structure",
      description: "Create initial project folders and configuration files",
      status: "completed",
      priority: "high",
      dueDate: "2025-09-15T00:00:00.000Z",
      assignee: {
        name: "John Doe",
        avatar: "/public/icons/github-mark.png",
      },
      tags: ["setup", "config"],
    },
    {
      id: "demo-2",
      title: "Design user interface mockups",
      description:
        "Create wireframes and high-fidelity designs for the main dashboard",
      status: "completed",
      priority: "medium",
      dueDate: "2025-09-16T00:00:00.000Z",
      assignee: {
        name: "Sarah Wilson",
        avatar: "/public/icons/github-mark.png",
      },
      tags: ["design", "ui/ux"],
    },
    {
      id: "demo-3",
      title: "Implement authentication system",
      description: "Set up user login, registration, and session management",
      status: "in-progress",
      priority: "high",
      dueDate: "2025-09-18T00:00:00.000Z",
      assignee: {
        name: "Mike Chen",
        avatar: "/public/icons/github-mark.png",
      },
      tags: ["backend", "security"],
    },
    {
      id: "demo-4",
      title: "Create responsive navigation",
      description:
        "Build mobile-friendly navigation component with dark mode support",
      status: "in-progress",
      priority: "medium",
      dueDate: "2025-09-19T00:00:00.000Z",
      assignee: {
        name: "Emily Rodriguez",
        avatar: "/public/icons/github-mark.png",
      },
      tags: ["frontend", "responsive"],
    },
    {
      id: "demo-5",
      title: "Set up database schema",
      description:
        "Design and implement the database structure for user and project data",
      status: "review",
      priority: "high",
      dueDate: "2025-11-12T00:00:00.000Z",
      assignee: {
        name: "David Kumar",
        avatar: "/public/icons/github-mark.png",
      },
      tags: ["database", "backend"],
    },
    {
      id: "demo-6",
      title: "Write API documentation",
      description:
        "Document all API endpoints with examples and response formats",
      status: "review",
      priority: "low",
      dueDate: "2025-09-25T00:00:00.000Z",
      assignee: {
        name: "Lisa Thompson",
        avatar: "/public/icons/github-mark.png",
      },
      tags: ["documentation", "api"],
    },
    {
      id: "demo-7",
      title: "Implement real-time notifications",
      description: "Add WebSocket support for live updates and notifications",
      status: "todo",
      priority: "medium",
      dueDate: "2025-09-17T00:00:00.000Z", // Tomorrow
      assignee: {
        name: "Alex Park",
        avatar: "/public/icons/github-mark.png",
      },
      tags: ["realtime", "websocket"],
    },
    {
      id: "demo-8",
      title: "Add data visualization charts",
      description:
        "Integrate charts and graphs for project analytics and reporting",
      status: "todo",
      priority: "low",
      dueDate: "2025-09-16T00:00:00.000Z", // Yesterday (overdue)
      assignee: {
        name: "Rachel Green",
        avatar: "/public/icons/github-mark.png",
      },
      tags: ["charts", "analytics"],
    },
    {
      id: "demo-9",
      title: "Performance optimization",
      description:
        "Optimize loading times and implement lazy loading for better UX",
      status: "todo",
      priority: "medium",
      dueDate: "2025-10-02",
      assignee: {
        name: "Tom Anderson",
        avatar: "/public/icons/github-mark.png",
      },
      tags: ["performance", "optimization"],
    },
    {
      id: "demo-10",
      title: "Security audit and testing",
      description:
        "Conduct thorough security testing and implement necessary fixes",
      status: "todo",
      priority: "high",
      dueDate: "2025-10-05",
      assignee: {
        name: "Jessica Brown",
        avatar: "/public/icons/github-mark.png",
      },
      tags: ["security", "testing"],
    },
  ];

  // State for managing tasks (allows drag and drop updates)
  const [tasks, setTasks] = useState(() => {
    // return project?.tasks?.length > 0 ? project.tasks : initialDemoTasks;
    return projectTasks.length > 0 ? projectTasks : initialDemoTasks;
  });

  // Update tasks when project changes
  useEffect(() => {
    if (projectTasks?.length > 0) {
      setTasks(projectTasks);
    }
  }, [projectTasks]);

  // Use demo tasks if project has no tasks or if project is undefined
  const tasksToDisplay = tasks;

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
  const groupedTasks = useMemo(() => {
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

    tasksToDisplay?.forEach((task) => {
      const status = task.status?.toLowerCase() || "todo";
      const column = statusMapping[status] || "todo";
      groups[column].push(task);
    });

    return groups;
  }, [tasksToDisplay]);

  // Drag and drop handlers
  const handleDragStart = (e, task) => {
    console.log(e);
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    console.log(e);
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, columnId) => {
    console.log(e);
    e.preventDefault();
    setDraggedOver(columnId);
  };

  const handleDragLeave = (e) => {
    console.log(e);

    e.preventDefault();
    if (!e.relatedTarget?.closest(`[data-column="${draggedOver}"]`)) {
      setDraggedOver(null);
    }
  };

  const handleDrop = async (e, targetColumn) => {
    console.log(e);

    e.preventDefault();
    setDraggedOver(null);

    if (draggedTask && draggedTask.status !== targetColumn) {
      // Add task to updating set
      setUpdatingTasks(prev => new Set([...prev, draggedTask.id]));

      // Update the task status in the local state for immediate UI feedback
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggedTask.id ? { ...task, status: targetColumn } : task
        )
      );

      // Set visual feedback for successful move
      setLastMoved(draggedTask.id);
      setTimeout(() => setLastMoved(null), 2000);

      // Update task status in the database
      try {
        const result = await updateTaskStatus(
          draggedTask.id, 
          targetColumn, 
          project?.id || "demo-project", // Use project ID or demo for demo tasks
          "current-user-id" // Replace with actual user ID from auth context
        );

        if (result.success) {
          console.log(`✅ Successfully moved task ${draggedTask.id} from ${draggedTask.status} to ${targetColumn}`);
          console.log("Database update result:", result);
        } else {
          console.error("❌ Failed to update task in database:", result.message);
          // Revert the local state change if database update failed
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === draggedTask.id ? { ...task, status: draggedTask.status } : task
            )
          );
        }
      } catch (error) {
        console.error("❌ Error updating task status:", error);
        // Revert the local state change if there was an error
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === draggedTask.id ? { ...task, status: draggedTask.status } : task
          )
        );
      } finally {
        // Remove task from updating set
        setUpdatingTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(draggedTask.id);
          return newSet;
        });
      }
    }

    setDraggedTask(null);
  };

  // Task card component
  const TaskCard = ({ task }) => {
    const isUpdating = updatingTasks.has(task.id);
    
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

    // Check if task is overdue
    const isOverdue = () => {
      if (!task.dueDate || task.status === "completed") return false;
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    };

    const getDueDateColor = () => {
      if (!task.dueDate) return "text-gray-500 dark:text-gray-400";

      const today = new Date();
      const dueDate = new Date(task.dueDate);
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (task.status === "completed") {
        return "text-green-600 dark:text-green-400";
      } else if (diffDays < 0) {
        return "text-red-600 dark:text-red-400 font-medium"; // Overdue
      } else if (diffDays <= 1) {
        return "text-orange-600 dark:text-orange-400 font-medium"; // Due today/tomorrow
      } else if (diffDays <= 3) {
        return "text-yellow-600 dark:text-yellow-400"; // Due soon
      } else {
        return "text-gray-500 dark:text-gray-400"; // Normal
      }
    };

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            // Could implement keyboard navigation here
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Drag to move task: ${task.title}`}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-4 mb-3 cursor-move hover:shadow-md transition-all duration-200 ${
          draggedTask?.id === task.id ? "opacity-50 scale-95 shadow-lg" : ""
        } ${
          lastMoved === task.id
            ? "ring-2 ring-green-400 bg-green-50 dark:bg-green-900/20"
            : ""
        } ${
          isUpdating 
            ? "ring-2 ring-blue-400 bg-blue-50 dark:bg-blue-900/20 cursor-wait" 
            : "hover:scale-[1.02] active:scale-95"
        } focus:ring-2 focus:ring-blue-400 focus:outline-none`}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 flex items-center">
            {task.title}
            {isUpdating && (
              <span className="ml-2 inline-block w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
            )}
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
            {(task.labels || task.tags)?.map((label, index) => (
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
          <div className={`mt-2 text-xs ${getDueDateColor()}`}>
            {isOverdue() && (
              <span className="">
                <IoMdWarning className="inline mr-1 text-red-500" />
              </span>
            )}
            Due: {formatDate(task.dueDate)}
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
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Drag and drop tasks to update their status
          </p>
          {/*  */}
        </div>
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
                ? "ring-2 ring-blue-400 bg-opacity-75 scale-[1.02]"
                : ""
            } ${
              draggedTask
                ? "border-2 border-dashed border-gray-300 dark:border-gray-600"
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
