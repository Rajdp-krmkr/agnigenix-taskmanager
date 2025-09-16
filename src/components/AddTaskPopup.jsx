import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaCalendarAlt, FaUser, FaFlag, FaTasks } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useAuthContext } from "@/context/AuthContext";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Image from "next/image";

const AddTaskPopup = ({
  isOpen,
  onClose,
  projectId,
  projectMembers = [],
  // onTaskAdded,
  taskProgress,
  setTaskProgress,
  setProjectTasks,
}) => {
  const { user } = useAuthContext();

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    status: "todo",
    priority: "medium",
  });

  const [loading, setLoading] = useState(false);
  const [showDropdowns, setShowDropdowns] = useState({
    assignee: false,
    status: false,
    priority: false,
  });

  // Reset form when popup opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        status: "todo",
        priority: "medium",
      });
      setShowDropdowns({
        assignee: false,
        status: false,
        priority: false,
      });
    }
  }, [isOpen]);

  // Options for dropdowns
  const statusOptions = [
    { value: "todo", label: "To Do", color: "bg-gray-100 text-gray-800" },
    {
      value: "in-progress",
      label: "In Progress",
      color: "bg-blue-100 text-blue-800",
    },
    { value: "done", label: "Done", color: "bg-green-100 text-green-800" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "high", label: "High", color: "bg-red-100 text-red-800" },
  ];

  // Handle form input changes
  const handleInputChange = (field, value) => {
    console.log(
      `🔄 handleInputChange - Field: ${field}, Value:`,
      value,
      `Type: ${typeof value}`
    );
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Toggle dropdown visibility
  const toggleDropdown = (dropdown) => {
    setShowDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    if (!projectId) {
      alert("Project ID is required");
      return;
    }

    setLoading(true);

    try {
      const taskData = {
        projectId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        assignedTo: formData.assignedTo || null,
        createdBy: user?.uid,
        createdAt: serverTimestamp(),
        dueDate: formData.dueDate
          ? new Date(formData.dueDate).toISOString()
          : null,
        completedAt: null,
        status: formData.status,
        priority: formData.priority,
      };

      // Add task to Firestore
      const docRef = await addDoc(collection(db, "tasks"), taskData);


      if(docRef.id) {
        setProjectTasks((prevTasks) => [
          ...prevTasks,
          {
            id: docRef.id,
            ...taskData,
            createdAt: new Date().toISOString(),
          },
        ]);
        setTaskProgress({
          ...taskProgress,
          [formData.status === "in-progress" ? "inProgress" : formData.status]:
            taskProgress[formData.status === "in-progress" ? "inProgress" : formData.status] + 1,

        })
      }

      // Close popup and reset form
      onClose();
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Close popup when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add New Task
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <RxCross2 size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter task title"
              required
            />
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter task description"
            />
          </div>
          {/* /* Assignee Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assign To
            </label>
            <button
              type="button"
              onClick={() => toggleDropdown("assignee")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white flex items-center justify-between"
            >
              <span className="flex items-center">
                {formData.assignedTo ? (
                  (() => {
                    const assignedMember = projectMembers.find(
                      (m) => m.uid === formData.assignedTo
                    );
                    return assignedMember ? (
                      <div className="flex items-center">
                        <Image
                          src={assignedMember.photoURL}
                          width={24}
                          height={24}
                          className="rounded-full border border-gray-300 mr-2"
                          alt="assignee-photo"
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-sm font-medium">
                            {assignedMember.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            @{assignedMember.username}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <FaUser className="mr-2 text-gray-400" /> Unknown User
                      </>
                    );
                  })()
                ) : (
                  <>
                    <FaUser className="mr-2 text-gray-400" /> Select assignee
                  </>
                )}
              </span>
              <MdKeyboardArrowDown
                className={`transition-transform ${
                  showDropdowns.assignee ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdowns.assignee && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
               
                {projectMembers.map((member) => {
                  console.log(member);
                  return (
                    <div
                      key={member.user_id}
                      onClick={() => {
                        handleInputChange("assignedTo", member.uid);
                        // console.log(member.uid)
                        toggleDropdown("assignee");
                      }}
                      className="px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center space-x-3"
                    >
                      <div className="flex-shrink-0">
                        <Image
                          src={member?.photoURL}
                          width={40}
                          height={40}
                          className="rounded-full border-2 border-white"
                          alt="profile-photo"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {member.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          @{member.username}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          {/* Status and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <button
                type="button"
                onClick={() => toggleDropdown("status")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white flex items-center justify-between"
              >
                <span className="flex items-center">
                  <FaTasks className="mr-2 text-gray-400" />
                  {
                    statusOptions.find((s) => s.value === formData.status)
                      ?.label
                  }
                </span>
                <MdKeyboardArrowDown
                  className={`transition-transform ${
                    showDropdowns.status ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showDropdowns.status && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                  {statusOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        handleInputChange("status", option.value);
                        toggleDropdown("status");
                      }}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${option.color}`}
                      >
                        {option.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Priority Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <button
                type="button"
                onClick={() => toggleDropdown("priority")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white flex items-center justify-between"
              >
                <span className="flex items-center">
                  <FaFlag className="mr-2 text-gray-400" />
                  {
                    priorityOptions.find((p) => p.value === formData.priority)
                      ?.label
                  }
                </span>
                <MdKeyboardArrowDown
                  className={`transition-transform ${
                    showDropdowns.priority ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showDropdowns.priority && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                  {priorityOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        handleInputChange("priority", option.value);
                        toggleDropdown("priority");
                      }}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${option.color}`}
                      >
                        {option.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md transition-colors ${
                loading
                  ? "bg-gray-200 text-gray-400 cursor-none"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } disabled:opacity-50`}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskPopup;
