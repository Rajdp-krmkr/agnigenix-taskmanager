import React from "react";
import { MdBarChart } from "react-icons/md";
import { FaCheckCircle, FaUserFriends } from "react-icons/fa";

const ProjectTabs = ({ activeTab, setActiveTab, project }) => {
  const tabs = [
    { id: "overview", label: "Overview", icon: <MdBarChart /> },
    { id: "tasks", label: "Tasks", icon: <FaCheckCircle /> },
    { id: "team", label: "Team", icon: <FaUserFriends /> },
  ];

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800 bg-white">
      <nav className="flex space-x-6 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <span className="mr-1.5 inline-flex items-center">{tab.icon}</span>
            {tab.label}
            {tab.id === "team" && <span> ({project?.members?.length || 0})</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProjectTabs;
