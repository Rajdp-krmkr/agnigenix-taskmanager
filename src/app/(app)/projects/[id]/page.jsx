"use client";
import fetchProjectById from "@/lib/utils/projectService";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { FaRocket, FaChartBar, FaChartPie, FaChartLine } from "react-icons/fa";
import { HiViewGrid, HiViewList } from "react-icons/hi";
import {
  ProjectHeader,
  ProjectTabs,
  TaskStatusCard,
  ProjectProgressCard,
  RecentActivityCard,
  TaskItem,
  TeamMemberItem,
  KanbanBoard,
  MembersContributionCard,
  OverdueTasksCard,
  WorkloadBalanceCard,
  TaskTrendsCard,
  PriorityBreakdown,
  AverageCompletionTime,
} from "@/components/ProjectComponents";
import TypeWriterLoader from "@/components/typewriterloader";
import AddTaskPopup from "@/components/AddTaskPopup";
import { useProjectContext } from "@/context/ProjectContext";
import { collection, doc, getDocs, query, where } from "@firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { fetchTasks } from "@/lib/utils/fetchTasks";
import { getTaskProgress } from "@/lib/utils/ProjectAnalytics";

const Project = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const {
    currentProject,
    setCurrentProject,
    isCurrentProjectLoading,
    setIsCurrentProjectLoading,
  } = useProjectContext();

  const [activeTab, setActiveTab] = useState("overview");
  const [showDetails, setShowDetails] = useState(false);
  const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);
  const [taskViewMode, setTaskViewMode] = useState("grid"); // "grid" or "list"
  const [overviewViewMode, setOverviewViewMode] = useState("cards"); // "cards" or "charts"

  const [projectMembers, setProjectMembers] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [taskProgress, setTaskProgress] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProject = async () => {
      setIsCurrentProjectLoading(true);
      try {
        const projectData = await fetchProjectById(id);

        if (isMounted) {
          if (projectData) {
            console.log(projectData);
            setCurrentProject(projectData);
          } else {
            // If no project is found, fallback to dummy data
            setCurrentProject(null);
          }
          setIsCurrentProjectLoading(false);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        if (isMounted) {
          setCurrentProject(null);
          setIsCurrentProjectLoading(false);
        }
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
      setIsCurrentProjectLoading(false);
    };
  }, [id, setCurrentProject, setIsCurrentProjectLoading]);

  useEffect(() => {
    const fetchTaskProgress = async () => {
      const progress = await getTaskProgress(id);
      setTaskProgress(progress);
    };

    fetchTaskProgress();
  }, [id]);

  useEffect(() => {
    const fetchTaskFunc = async () => {
      const tasks = await fetchTasks(id);
      console.log("tasks: ", tasks);
      setProjectTasks(tasks);
    };
    if (id) {
      fetchTaskFunc();
    }
  }, [id]);

  const project = currentProject;

  const fetchMemberDetails = useCallback(async (members) => {
    const newArray = members.map((member) => member.user_id);

    try {
      const docsRef = collection(db, "users");
      const docsSnap = query(docsRef, where("uid", "in", newArray));
      const memberDocs = await getDocs(docsSnap);
      const membersData = memberDocs.docs.map((doc) => ({
        ...doc.data(),
        role: members.find((member) => member.user_id === doc.data().uid)?.role,
      }));
      console.log(membersData);
      setProjectMembers(membersData);
    } catch (error) {
      console.error("Error fetching member details:", error);
    }
  }, []);

  useEffect(() => {
    if (project && project?.members.length > 0) {
      fetchMemberDetails(project?.members);
    }
  }, [project, fetchMemberDetails]);

  // Optimized event handlers with useCallback
  const handleAddTask = useCallback(() => {
    setShowAddTaskPopup(true);
  }, []);

  const handleCloseAddTaskPopup = useCallback(() => {
    setShowAddTaskPopup(false);
  }, []);

  // Optimized view mode toggles
  const handleToggleOverviewMode = useCallback(() => {
    setOverviewViewMode((prev) => (prev === "cards" ? "charts" : "cards"));
  }, []);

  const handleToggleTaskViewMode = useCallback(() => {
    setTaskViewMode((prev) => (prev === "list" ? "grid" : "list"));
  }, []);

  // Memoized utility functions
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "todo":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, []);

  const getPriorityColor = useCallback((priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }, []);

  const getUserStatus = useCallback((status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  }, []);

  // Memoized render functions (moved before early return)
  const renderOverview = useCallback(
    () => (
      <div className="space-y-4">
        {/* View Mode Toggle */}
        <div className="flex justify-end">
          <button
            onClick={handleToggleOverviewMode}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {overviewViewMode === "cards" ? (
              <>
                <FaChartBar className="w-4 h-4" />
              </>
            ) : (
              <>
                <HiViewGrid className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Combined Progress and Tasks Status */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <TaskStatusCard
            taskProgress={taskProgress}
            isLoading={taskProgress == null}
            overviewViewMode={overviewViewMode}
          />
          <ProjectProgressCard
            project={project}
            getPriorityColor={getPriorityColor}
            taskProgress={taskProgress}
            isLoading={taskProgress == null}
            overviewViewMode={overviewViewMode}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-3">
            <OverdueTasksCard
              projectTasks={projectTasks}
              projectMembers={projectMembers}
              isLoading={isCurrentProjectLoading || projectTasks.length === 0}
              overviewViewMode={overviewViewMode}
            />
          </div>
          <div className="lg:col-span-3">
            <AverageCompletionTime
              projectTasks={projectTasks}
              isLoading={isCurrentProjectLoading || projectTasks.length === 0}
              overviewViewMode={overviewViewMode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <MembersContributionCard
              projectId={id}
              tasks={projectTasks}
              projectMembers={projectMembers}
              isLoading={isCurrentProjectLoading}
              overviewViewMode={overviewViewMode}
            />
          </div>
          <div className="lg:col-span-2">
            <WorkloadBalanceCard
              projectTasks={projectTasks}
              projectMembers={projectMembers}
              isLoading={isCurrentProjectLoading || projectTasks.length === 0}
              overviewViewMode={overviewViewMode}
            />
          </div>
        </div>

        {/* Task Trends and Priority Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <PriorityBreakdown
              projectTasks={projectTasks}
              isLoading={isCurrentProjectLoading || projectTasks.length === 0}
              overviewViewMode={overviewViewMode}
            />
          </div>
          <div className="lg:col-span-3 flex flex-col gap-4">
            <TaskTrendsCard
              projectTasks={projectTasks}
              isLoading={isCurrentProjectLoading || projectTasks.length === 0}
              overviewViewMode={overviewViewMode}
            />
            <RecentActivityCard
              activities={project?.recentActivity || []}
              overviewViewMode={overviewViewMode}
            />
          </div>
        </div>
      </div>
    ),
    [
      handleToggleOverviewMode,
      overviewViewMode,
      taskProgress,
      project,
      getPriorityColor,
      isCurrentProjectLoading,
      projectTasks,
      projectMembers,
      id,
    ]
  );

  const renderTasks = useCallback(
    () => (
      <div className="space-y-4">
        {/* View Mode Toggle */}
        <div className="flex justify-end">
          <button
            onClick={handleToggleTaskViewMode}
            className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors text-gray-700 dark:text-gray-300"
          >
            {taskViewMode === "list" ? (
              <HiViewGrid className="w-4 h-4" />
            ) : (
              <HiViewList className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Tasks Display */}
        {projectTasks.length > 0 ? (
          <div
            className={
              taskViewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-3"
            }
          >
            {projectTasks.map((task) => (
              <TaskItem
                key={task?.id}
                task={task}
                getStatusColor={getStatusColor}
                getPriorityColor={getPriorityColor}
                assignee={projectMembers.find(
                  (member) => member.uid == task.assignedTo
                )}
                viewMode={taskViewMode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No tasks available for this project.
          </div>
        )}
      </div>
    ),
    [
      handleToggleTaskViewMode,
      taskViewMode,
      projectTasks,
      projectMembers,
      getStatusColor,
      getPriorityColor,
    ]
  );

  const renderTeam = useCallback(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* // TODO add members details */}
        {projectMembers.length > 0 ? (
          projectMembers.map((member) => (
            <TeamMemberItem
              key={member?.id}
              member={member}
              getUserStatus={getUserStatus}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No team members assigned to this project.
          </div>
        )}
      </div>
    ),
    [projectMembers, getUserStatus]
  );

  const renderKanban = useCallback(
    () => <KanbanBoard project={project} projectTasks={projectTasks} />,
    [project, projectTasks]
  );

  if (isCurrentProjectLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <TypeWriterLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProjectHeader
        project={project}
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        getStatusColor={getStatusColor}
        onAddTask={handleAddTask}
      />
      <ProjectTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        project={project}
      />
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-4 mx-auto">
        <div>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "tasks" && renderTasks()}
          {activeTab === "kanban" && renderKanban()}
          {activeTab === "team" && renderTeam()}
        </div>
      </div>

      {/* Add Task Popup */}
      <AddTaskPopup
        isOpen={showAddTaskPopup}
        onClose={handleCloseAddTaskPopup}
        projectId={id}
        projectMembers={projectMembers || []}
        projectTasks={projectTasks}
        setProjectTasks={setProjectTasks}
        taskProgress={taskProgress}
        setTaskProgress={setTaskProgress}
      />
    </div>
  );
};

export default Project;
