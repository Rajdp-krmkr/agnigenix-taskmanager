import React from "react";
import Image from "next/image";

const TeamMemberItem = ({ member, getUserStatus }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Image
            src="/icons/github-mark.png"
            alt={member.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${getUserStatus(
              member.status
            )} rounded-full border-2 border-white dark:border-gray-800`}
          ></div>
        </div>
        <div className="flex-1">
          <h3 className="text-md font-medium text-gray-900 dark:text-white">
            {member.name}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            @{member.username}
          </p>
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
            {member.role}
          </p>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">Status:</span>
          <span
            className={`capitalize font-medium ${
              member.status === "online"
                ? "text-green-600 dark:text-green-400"
                : member.status === "away"
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {member.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberItem;
