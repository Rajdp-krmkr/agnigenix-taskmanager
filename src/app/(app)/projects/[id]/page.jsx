"use client";
import fetchProjectById from "@/lib/utils/projectService";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { FaRocket } from "react-icons/fa";
import {
  ProjectHeader,
  ProjectTabs,
  TaskStatusCard,
  ProjectProgressCard,
  RecentActivityCard,
  TaskItem,
  TeamMemberItem,
  KanbanBoard,
} from "@/components/ProjectComponents";
import TypeWriterLoader from "@/components/typewriterloader";
import AddTaskPopup from "@/components/AddTaskPopup";
import { useProjectContext } from "@/context/ProjectContext";
import { collection, doc, getDocs, query, where } from "@firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { fetchTasks } from "@/lib/utils/fetchTasks";

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

  const [projectMembers, setProjectMembers] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);

  // Memoized dummy data for project
  const dummyProject = useMemo(
    () => ({
      id: id || "proj-001",
      title: "Agnigenix Task Manager",
      description:
        "A comprehensive task management system with real-time collaboration, user management, and workspace organization features.",
      status: "In Progress",
      priority: "High",
      progress: 65,
      createdAt: "2025-08-01",
      dueDate: "2025-12-15",
      icon: <FaRocket />,
      color: "#3B82F6",
      members: [
        {
          id: "user-1",
          name: "Rajdeep Karmakar",
          username: "rajdp-krmkr",
          role: "Project Manager",
          avatar: "/public/icons/github-mark.png",
          status: "online",
        },
        {
          id: "user-2",
          name: "Sarah Johnson",
          username: "sarah.j",
          role: "Frontend Developer",
          avatar: "/public/icons/github-mark.png",
          status: "online",
        },
        {
          id: "user-3",
          name: "Mike Chen",
          username: "mike.chen",
          role: "Backend Developer",
          avatar: "/public/icons/github-mark.png",
          status: "away",
        },
        {
          id: "user-4",
          name: "Emma Wilson",
          username: "emma.w",
          role: "UI/UX Designer",
          avatar: "/public/icons/github-mark.png",
          status: "offline",
        },
      ],
      tasks: [
        {
          id: "task-1",
          title: "Design user authentication flow",
          description: "Create wireframes and mockups for login/signup process",
          status: "completed",
          priority: "high",
          assignee: {
            name: "Emma Wilson",
            avatar: "/public/icons/github-mark.png",
          },
          dueDate: "2025-08-15",
          labels: ["design", "auth"],
        },
        {
          id: "task-2",
          title: "Implement user search functionality",
          description:
            "Build real-time user search with debouncing and filtering",
          status: "in-progress",
          priority: "high",
          assignee: {
            name: "Sarah Johnson",
            avatar: "/public/icons/github-mark.png",
          },
          dueDate: "2025-08-28",
          labels: ["frontend", "search"],
        },
        {
          id: "task-3",
          title: "Setup Firebase authentication",
          description:
            "Configure Firebase auth with email/password and Google sign-in",
          status: "completed",
          priority: "medium",
          assignee: {
            name: "Mike Chen",
            avatar: "/public/icons/github-mark.png",
          },
          dueDate: "2025-08-10",
          labels: ["backend", "auth"],
        },
        {
          id: "task-4",
          title: "Create project dashboard",
          description:
            "Build responsive dashboard with project overview and statistics",
          status: "todo",
          priority: "medium",
          assignee: {
            name: "Sarah Johnson",
            avatar: "/public/icons/github-mark.png",
          },
          dueDate: "2025-09-05",
          labels: ["frontend", "dashboard"],
        },
        {
          id: "task-5",
          title: "Implement real-time notifications",
          description: "Add real-time notification system for task updates",
          status: "todo",
          priority: "low",
          assignee: {
            name: "Mike Chen",
            avatar: "/public/icons/github-mark.png",
          },
          dueDate: "2025-09-20",
          labels: ["backend", "notifications"],
        },
      ],
      recentActivity: [
        {
          id: "activity-1",
          type: "task_completed",
          user: "Emma Wilson",
          action: "completed task",
          target: "Design user authentication flow",
          timestamp: "2 hours ago",
        },
        {
          id: "activity-2",
          type: "comment",
          user: "Sarah Johnson",
          action: "commented on",
          target: "Implement user search functionality",
          timestamp: "4 hours ago",
        },
        {
          id: "activity-3",
          type: "task_assigned",
          user: "Rajdeep Karmakar",
          action: "assigned task to Mike Chen",
          target: "Implement real-time notifications",
          timestamp: "1 day ago",
        },
      ],
    }),
    [id]
  );

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
            setCurrentProject(dummyProject);
          }
          setIsCurrentProjectLoading(false);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
        if (isMounted) {
          setCurrentProject(dummyProject); // Fallback to dummy data
          setIsCurrentProjectLoading(false);
        }
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
      setIsCurrentProjectLoading(false);
    };
  }, [id, dummyProject, setCurrentProject, setIsCurrentProjectLoading]);

  useEffect(() => {
    const fetchTaskFunc = async () => {
      const tasks = await fetchTasks(id);
      setProjectTasks(tasks);
    };
    if (id) {
      fetchTaskFunc();
    }
  }, [id]);

  const project = currentProject || dummyProject;

  const fetchMemberDetails = async (members) => {
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
  };

  useEffect(() => {
    if (project && project?.members.length > 0) {
      fetchMemberDetails(project?.members);
    }
  }, [project?.members]);

  if (isCurrentProjectLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <TypeWriterLoader />
      </div>
    );
  }

  // Add task handlers
  const handleAddTask = () => {
    setShowAddTaskPopup(true);
  };

  const handleCloseAddTaskPopup = () => {
    setShowAddTaskPopup(false);
  };

  const handleTaskAdded = (newTask) => {
    // Update the project tasks list with the new task
    setCurrentProject((prev) => ({
      ...prev,
      tasks: [...(prev?.tasks || []), newTask],
    }));
    console.log("New task added:", newTask);
  };

  const getStatusColor = (status) => {
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
  };

  const getPriorityColor = (priority) => {
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
  };

  const getUserStatus = (status) => {
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
  };

  const renderOverview = () => (
    <div className="space-y-4">
      {/* Combined Progress and Tasks Status */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <TaskStatusCard project={project} />
        <ProjectProgressCard
          project={project}
          getPriorityColor={getPriorityColor}
        />
      </div>

      {/* Team Members */}
      {/* <TeamMemberCard project={project} /> */}

      {/* Recent Activity */}
      <RecentActivityCard activities={project?.recentActivity || []} />
    </div>
  );

  const renderTasks = () => (
    <div className="space-y-3">
      {projectTasks.map((task) => (
        <TaskItem
          key={task?.id}
          task={task}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
          assignee={projectMembers.find(
            (member) => member.uid == task.assignedTo
          )}
        />
      )) || (
        <div className="text-center py-8 text-gray-500">
          No tasks available for this project.
        </div>
      )}
    </div>
  );

  const renderTeam = () => (
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
  );

  const renderKanban = () => <KanbanBoard project={project} />;

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
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
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
        onTaskAdded={handleTaskAdded}
      />
    </div>
  );
};

export default Project;
