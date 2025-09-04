import React from "react";
import { FaEye } from "react-icons/fa";

const RecentActivityCard = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 h-full">
      <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
        Recent Activity
      </h3>
      <div className="space-y-3">
        {activities?.length > 0 ? (
          activities.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-2">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <FaEye className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-900 dark:text-white">
                  <span className="font-medium">
                    {activity?.user || "Someone"}
                  </span>{" "}
                  {activity?.action || "updated"}{" "}
                  <span className="font-medium">
                    {activity?.target || "something"}
                  </span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity?.timestamp || "recently"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-3 text-sm text-gray-500">
            No recent activity available.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityCard;
