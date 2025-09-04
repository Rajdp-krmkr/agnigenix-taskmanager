import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getMemberContribution } from "@/lib/utils/getMembersContribution";
import { FaUser, FaTasks, FaCheckCircle } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";

const MembersContributionCard = ({ projectId, projectMembers, isLoading }) => {
  const [contributions, setContributions] = useState({});
  const [contributionLoading, setContributionLoading] = useState(true);

  useEffect(() => {
    const fetchContributions = async () => {
      if (!projectId) return;

      try {
        setContributionLoading(true);
        const contributionData = await getMemberContribution(projectId);
        setContributions(contributionData);
      } catch (error) {
        console.error("Error fetching member contributions:", error);
      } finally {
        setContributionLoading(false);
      }
    };

    fetchContributions();
  }, [projectId]);

  const getMemberInfo = (memberId) => {
    return (
      projectMembers?.find((member) => member.uid === memberId) || {
        displayName: "Unknown User",
        photoURL: null,
        uid: memberId,
      }
    );
  };

  const calculateCompletionRate = (assigned, completed) => {
    if (assigned === 0) return 0;
    return Math.round((completed / assigned) * 100);
  };

  const sortedContributions = Object.entries(contributions).sort(
    ([, a], [, b]) => b.assigned + b.completed - (a.assigned + a.completed)
  );

  if (isLoading || contributionLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-40"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-24"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
      <div className="flex items-center mb-4">
        <HiTrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
        <h3 className="text-md font-semibold text-gray-900 dark:text-white">
          Member Contributions
        </h3>
      </div>

      {sortedContributions.length > 0 ? (
        <div className="space-y-4">
          {sortedContributions.map(([memberId, contribution]) => {
            const member = getMemberInfo(memberId);
            const completionRate = calculateCompletionRate(
              contribution.assigned,
              contribution.completed
            );

            return (
              <div
                key={memberId}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {/* Member Avatar */}
                  <div className="relative">
                    {member.photoURL ? (
                      <Image
                        src={member.photoURL}
                        alt={member.displayName}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <FaUser className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Member Info */}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name || "Unknown User"}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <FaTasks className="w-3 h-3 mr-1" />
                        {contribution.assigned} assigned
                      </div>
                      <div className="flex items-center">
                        <FaCheckCircle className="w-3 h-3 mr-1 text-green-500" />
                        {contribution.completed} completed
                      </div>
                    </div>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="text-right">
                  <div className={`text-sm font-semibold ${completionRate >= 80 ? 'text-green-500' : completionRate >= 60 ? 'dark:text-white text-gray-700' : 'text-red-500'}`}>
                    {completionRate}%
                  </div>
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        completionRate >= 80
                          ? "bg-green-500"
                          : completionRate >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <FaUser className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No member contributions yet</p>
        </div>
      )}
    </div>
  );
};

export default MembersContributionCard;
