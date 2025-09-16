import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getMemberContribution } from "@/lib/utils/getMembersContribution";
import { FaUser, FaTasks, FaCheckCircle, FaChartBar } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const MembersContributionCard = ({
  tasks,
  projectId,
  projectMembers,
  isLoading,
  projectTasks,
  overviewViewMode,
}) => {
  const [contributions, setContributions] = useState({});
  const [contributionLoading, setContributionLoading] = useState(true);

  useEffect(() => {
    const fetchContributions = async () => {
      if (!projectId) return;

      try {
        setContributionLoading(true);
        const contributionData = await getMemberContribution(tasks);
        setContributions(contributionData);
      } catch (error) {
        console.error("Error fetching member contributions:", error);
      } finally {
        setContributionLoading(false);
      }
    };

    fetchContributions();
  }, [projectId, tasks]);

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

  const chartData =
    !projectMembers || !projectTasks
      ? []
      : projectMembers
          .map((member) => {
            const memberTasks = projectTasks.filter(
              (task) => task.assignee?.uid === member.uid
            );
            const completedTasks = memberTasks.filter(
              (task) => task.status === "completed"
            ).length;
            const totalTasks = memberTasks.length;

            return {
              name:
                member.displayName || member.email?.split("@")[0] || "Unknown",
              completed: completedTasks,
              total: totalTasks,
              pending: totalTasks - completedTasks,
            };
          })
          .filter((member) => member.total > 0);

  if (isLoading || contributionLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded mb-3 sm:mb-4 w-32 sm:w-40"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-20 sm:w-24"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 sm:w-32"></div>
                </div>
                <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-10 sm:w-12 flex-shrink-0"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (overviewViewMode == "cards") {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700">
        <div className="flex items-center mb-4">
          <FaChartBar className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
          <h3 className="text-md font-semibold text-gray-900 dark:text-white">
            Member Task Contribution
          </h3>
        </div>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm border border-transparent hover:dark:border-gray-700 transition-all hover:shadow-md duration-200">
      <div className="flex items-center mb-3 sm:mb-4">
        <HiTrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
        <h3 className="text-sm sm:text-md font-semibold text-gray-900 dark:text-white">
          Member Contributions
        </h3>
      </div>

      {sortedContributions.length > 0 ? (
        <div className="space-y-3 sm:space-y-4">
          {sortedContributions.map(([memberId, contribution]) => {
            const member = getMemberInfo(memberId);
            const completionRate = calculateCompletionRate(
              contribution.assigned,
              contribution.completed
            );

            return (
              <div
                key={memberId}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2 sm:space-y-0 hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors duration-150"
              >
                {/* Member Info Section */}
                <div className="flex items-center space-x-3 min-w-0">
                  {/* Member Avatar */}
                  <div className="relative flex-shrink-0">
                    {member.photoURL ? (
                      <Image
                        src={member.photoURL}
                        alt={member.displayName}
                        width={32}
                        height={32}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <FaUser className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Member Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                      {member.name || "Unknown User"}
                    </p>
                    <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-4 space-y-1 xs:space-y-0 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <FaTasks className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {contribution.assigned} assigned
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaCheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 text-green-500 flex-shrink-0" />
                        <span className="truncate">
                          {contribution.completed} completed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Completion Rate Section */}
                <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end space-x-2 sm:space-x-0">
                  <div
                    className={`text-sm sm:text-base font-semibold ${
                      completionRate >= 80
                        ? "text-green-500"
                        : completionRate >= 60
                        ? "text-gray-700 dark:text-white"
                        : "text-red-500"
                    }`}
                  >
                    {completionRate}%
                  </div>
                  <div className="w-16 sm:w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 sm:h-2 mt-0 sm:mt-1">
                    <div
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
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
        <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
          <FaUser className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm sm:text-base">No member contributions yet</p>
        </div>
      )}
    </div>
  );
};

export default MembersContributionCard;
