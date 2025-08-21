import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { HiExclamationCircle, HiSparkles } from "react-icons/hi";

const ProjectForm = ({
  projectTitle,
  setProjectTitle,
  projectDescription,
  setProjectDescription,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  priority,
  setPriority,
  priorityOptions = [
    { 
      value: "low", 
      label: "Low", 
      color: "text-green-600", 
      bg: "bg-green-100",
      darkBg: "dark:bg-green-900/20",
      borderColor: "border-green-300",
      icon: <HiSparkles className="text-green-500" />
    },
    {
      value: "medium",
      label: "Medium",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      darkBg: "dark:bg-yellow-900/20",
      borderColor: "border-yellow-300",
      icon: <HiSparkles className="text-yellow-500" />
    },
    { 
      value: "high", 
      label: "High", 
      color: "text-orange-600", 
      bg: "bg-orange-100",
      darkBg: "dark:bg-orange-900/20",
      borderColor: "border-orange-300",
      icon: <HiSparkles className="text-orange-500" />
    },
    {
      value: "urgent",
      label: "Urgent",
      color: "text-red-600",
      bg: "bg-red-100",
      darkBg: "dark:bg-red-900/20",
      borderColor: "border-red-300",
      icon: <HiSparkles className="text-red-500" />
    },
  ],
  fieldErrors = {},
  touchedFields = {},
  validateField,
  setTouchedFields,
}) => {
  return (
    <div className="space-y-4">
      {/* Project Title */}
      <div className="group">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Project Title
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={projectTitle}
          onChange={(e) => {
            setProjectTitle(e.target.value);
            setTouchedFields && setTouchedFields((prev) => ({ ...prev, projectTitle: true }));
          }}
          onBlur={(e) => validateField && validateField("projectTitle", e.target.value)}
          placeholder="Enter project title"
          className={`w-full outline-none border-2 rounded-2xl p-4 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white transition-all duration-200 ${
            fieldErrors.projectTitle
              ? "border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-900/10"
              : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:shadow-lg"
          } hover:shadow-md`}
        />
        {fieldErrors?.projectTitle && touchedFields?.projectTitle && (
          <p className="text-red-500 text-xs mt-2 animate-slideInDown flex items-center gap-1">
            <HiExclamationCircle className="text-sm" />
            {fieldErrors.projectTitle}
          </p>
        )}
      </div>

      {/* Project Description */}
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Project Description
        </label>
        <textarea
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          placeholder="Enter project description (optional)"
          rows={4}
          className="w-full outline-none border-2 border-gray-300 dark:border-gray-600 rounded-2xl p-4 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white transition-all duration-200 focus:border-blue-500 hover:shadow-md focus:shadow-lg"
        ></textarea>
      </div>

      {/* Project Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <FaCalendarAlt className="text-green-500" />
            Start Date
            <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setTouchedFields && setTouchedFields((prev) => ({ ...prev, startDate: true }));
            }}
            onBlur={(e) => validateField && validateField("startDate", e.target.value)}
            className={`w-full outline-none border-2 rounded-2xl p-4 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white transition-all duration-200 ${
              fieldErrors.startDate
                ? "border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-900/10"
                : "border-gray-300 dark:border-gray-600 focus:border-green-500 focus:shadow-lg"
            } hover:shadow-md`}
          />
          {fieldErrors?.startDate && touchedFields?.startDate && (
            <p className="text-red-500 text-xs mt-2 animate-slideInDown flex items-center gap-1">
              <HiExclamationCircle className="text-sm" />
              {fieldErrors.startDate}
            </p>
          )}
        </div>
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <FaCalendarAlt className="text-red-500" />
            End Date
            <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setTouchedFields && setTouchedFields((prev) => ({ ...prev, endDate: true }));
            }}
            onBlur={(e) => validateField && validateField("endDate", e.target.value)}
            className={`w-full outline-none border-2 rounded-2xl p-4 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white transition-all duration-200 ${
              fieldErrors.endDate
                ? "border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-900/10"
                : "border-gray-300 dark:border-gray-600 focus:border-red-500 focus:shadow-lg"
            } hover:shadow-md`}
          />
          {fieldErrors?.endDate && touchedFields?.endDate && (
            <p className="text-red-500 text-xs mt-2 animate-slideInDown flex items-center gap-1">
              <HiExclamationCircle className="text-sm" />
              {fieldErrors.endDate}
            </p>
          )}
        </div>
      </div>

      {/* Priority - Enhanced with Gradients */}
      <div className="group">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          <HiSparkles className="text-yellow-500" />
          Priority Level
        </label>
        <div className="grid grid-cols-2 gap-3">
          {priorityOptions?.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => setPriority(option.value)}
              className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                priority === option.value
                  ? `${option.bg} ${option.darkBg} ${option.color} ${option.borderColor} border-2 shadow-lg scale-105`
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    priority === option.value
                      ? "bg-white/20"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  {option.icon}
                </div>
                <span className="font-semibold">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
