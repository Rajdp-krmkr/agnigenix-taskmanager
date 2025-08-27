import React from "react";
import { MdGroup } from "react-icons/md";

const TeamMemberCard = ({ project }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
      <div className="flex items-center">
        <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <MdGroup className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="ml-3">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Team Members
          </p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {project.members.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
