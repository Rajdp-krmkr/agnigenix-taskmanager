import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { db } from "@/lib/firebaseConfig";
import { collection, doc, setDoc, serverTimestamp } from "@firebase/firestore";
import { PostNotifications } from "@/Firebase Functions/GetAndPostNotifications";
import { resetInvitedUsersArray } from "@/lib/features/slice";
import { generateCustomCode } from "./getCustomCode";
import UserSearchResults, {
  UserSearchResultsForProjects,
} from "./userSearchResults";
import { GrStatusInfoSmall } from "react-icons/gr";
import {
  MdOutlineDoNotDisturbAlt,
  MdPersonAdd,
  MdAssignment,
  MdContentCopy,
  MdLink,
} from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { FaCalendarAlt, FaExclamationTriangle, FaLink } from "react-icons/fa";
import { ColorsArray } from "@/lib/utils/LogoColorsArray";
import { createProjectInFirestore } from "@/lib/utils/createProject";

const AddProjectPopup = ({
  activateNum,
  username,
  ProjectsArray,
  workspaceID,
  workspaceMembers,
  workspaceTitle,
  userid,
  setProjectsArray,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const invitedUsers = useSelector(
    (state) => state.invitedUsers.invitedUsersArray
  );

  // Popup state
  const [showCreateProjectPopup, setShowCreateProjectPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Project form fields
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignees, setAssignees] = useState([]);
  const [inviteUsers, setInviteUsers] = useState([]);
  const [createdBy, setCreatedBy] = useState(username);

  // Icon customization
  const [isCustomizingIcon, setIsCustomizingIcon] = useState(false);
  const [logoLetter, setLogoLetter] = useState("P");
  const [customizedLogo, setCustomizedLogo] = useState(null);

  // Validation & messages
  const [validationMessage, setValidationMessage] = useState(null);
  const [showAssigneeSearch, setShowAssigneeSearch] = useState(false);
  const [showInviteSearch, setShowInviteSearch] = useState(false);

  // Copy link functionality
  const [showAssigneeCopyLink, setShowAssigneeCopyLink] = useState(false);
  const [showInviteCopyLink, setShowInviteCopyLink] = useState(false);
  const [copiedAssigneeLink, setCopiedAssigneeLink] = useState(false);
  const [copiedViewLink, setCopiedViewLink] = useState(false);
  const [copiedEditLink, setCopiedEditLink] = useState(false);

  // Show all workspace members
  const [showAllMembers, setShowAllMembers] = useState(true);

  // Priority options
  const priorityOptions = [
    { value: "low", label: "Low", color: "text-green-600", bg: "bg-green-100" },
    {
      value: "medium",
      label: "Medium",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    { value: "high", label: "High", color: "text-red-600", bg: "bg-red-100" },
    {
      value: "urgent",
      label: "Urgent",
      color: "text-red-800",
      bg: "bg-red-200",
    },
  ];

  // Role options for invited users
  const roleOptions = [
    { value: "view", label: "View Only" },
    { value: "edit", label: "Edit Access" },
  ];

  // Show popup when activateNum changes
  useEffect(() => {
    if (activateNum > 0) {
      setShowCreateProjectPopup(true);
    }
  }, [activateNum]);

  // Validation function
  const validateProjectForm = () => {
    if (!projectTitle.trim()) {
      setValidationMessage({
        type: "error",
        message: "Project title is required",
      });
      return false;
    }
    if (projectTitle.length < 2 || projectTitle.length > 50) {
      setValidationMessage({
        type: "error",
        message: "Project title must be between 2 and 50 characters",
      });
      return false;
    }
    if (!startDate) {
      setValidationMessage({
        type: "error",
        message: "Start date is required",
      });
      return false;
    }
    if (!endDate) {
      setValidationMessage({ type: "error", message: "End date is required" });
      return false;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setValidationMessage({
        type: "error",
        message: "End date must be after start date",
      });
      return false;
    }
    setValidationMessage({
      type: "success",
      message: "Project details are valid",
    });
    return true;
  };

  // Handle assignee selection
  const handleAssigneeSelect = (user) => {
    if (!assignees.find((assignee) => assignee.user_id === user.uid)) {
      setAssignees([
        ...assignees,
        {
          user_id: user.uid,
          username: user.username,
          name: user.name,
          photoURL: user.photoURL,
          role: "edit", // Default role for assignees
        },
      ]);
    }
    setShowAssigneeSearch(false);
  };

  // Handle assignee removal
  const removeAssignee = (userId) => {
    setAssignees(assignees.filter((assignee) => assignee.user_id !== userId));
  };

  // Handle invite user with role selection
  const handleInviteUserWithRole = (user, role) => {
    if (!inviteUsers.find((invite) => invite.user_id === user.uid)) {
      setInviteUsers([
        ...inviteUsers,
        {
          user_id: user.uid,
          username: user.username,
          name: user.name,
          photoURL: user.photoURL,
          role: role,
        },
      ]);
    }
    setShowInviteSearch(false);
  };

  // Remove invited user
  const removeInvitedUser = (userId) => {
    setInviteUsers(inviteUsers.filter((invite) => invite.user_id !== userId));
  };

  // Helper function to get available workspace members
  const getAvailableWorkspaceMembers = () => {
    // const newWorkSpaceMembers = workspaceMembers.filter(
    //   (member) => member.uid !== userid
    // );
    return (
      workspaceMembers?.filter(
        (member) =>
          !assignees.find((assignee) => assignee.user_id == member.uid) &&
          !inviteUsers.find((invite) => invite.user_id == member.uid) &&
          member.uid !== userid
      ) || []
    );
  };

  // Copy link functions
  const generateAssigneeInviteLink = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      workspaceId: workspaceID,
      role: "edit",
      type: "assignee",
      invitedBy: username,
    });
    return `${baseUrl}/invite/workspace?${params.toString()}`;
  };

  const generateExternalInviteLink = (role = "view") => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      workspaceId: workspaceID,
      role: role,
      type: "external",
      invitedBy: username,
    });
    return `${baseUrl}/invite/workspace?${params.toString()}`;
  };

  const copyAssigneeLink = async () => {
    try {
      const link = generateAssigneeInviteLink();
      await navigator.clipboard.writeText(link);
      setCopiedAssigneeLink(true);
      setTimeout(() => setCopiedAssigneeLink(false), 2000);
    } catch (error) {
      console.error("Failed to copy assignee link:", error);
    }
  };

  const copyInviteLink = async (role = "view") => {
    try {
      const link = generateExternalInviteLink(role);
      await navigator.clipboard.writeText(link);

      if (role === "view") {
        setCopiedViewLink(true);
        setTimeout(() => setCopiedViewLink(false), 2000);
      } else {
        setCopiedEditLink(true);
        setTimeout(() => setCopiedEditLink(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy invite link:", error);
    }
  };

  // Send notifications to invited users
  const sendProjectNotifications = async (projectId, projectTitle) => {
    const allUsers = [...assignees, ...inviteUsers];

    for (const user of allUsers) {
      if (user.username !== username) {
        // Don't notify the creator
        try {
          await PostNotifications(
            user.username,
            `You've been invited to project "${projectTitle}"`,
            "project_invitation",
            {
              projectId,
              workspaceId: workspaceID,
              role: user.role,
              invitedBy: username,
            }
          );
        } catch (error) {
          console.error(
            `Failed to send notification to ${user.username}:`,
            error
          );
        }
      }
    }
  };

  // Handle project creation
  const handleCreateProject = async () => {
    if (!validateProjectForm()) return;

    setIsLoading(true);
    try {
      const projectId = generateCustomCode(12);

      // Prepare project data according to new schema
      const projectData = {
        workspace_id: workspaceID,
        title: projectTitle.trim(),
        description: projectDescription.trim(),
        deadlines: {
          start_date: startDate,
          end_date: endDate,
        },
        priority,
        members: [
          // Creator gets full access
          {
            user_id: username, // Assuming username is the user ID
            role: "admin",
          },
          // Add assignees with edit access
          ...assignees.map((assignee) => ({
            user_id: assignee.user_id,
            role: assignee.role,
          })),
          // Add invited users with specified roles
          ...inviteUsers.map((invite) => ({
            user_id: invite.user_id,
            role: invite.role,
          })),
        ],
        created_by: userid,
        logo: {
          letter: logoLetter,
          customized: customizedLogo,
        },
        status: "active",
      };

      // Create project in Firestore
      const projectId_final = await createProjectInFirestore(
        projectData,
        workspaceID
      );
      // Update workspace context with new project
      // dispatch(
      //   addProjectToWorkspace({ workspaceID, projectId: projectId_final })
      // );

      setProjectsArray((prevProjects) => [
        ...prevProjects,
        { id: projectId_final, title: projectTitle },
      ]);

      //TODO: add to workspace in context and update to fetch project details
      // Send notifications
      await sendProjectNotifications(projectId_final, projectTitle);

      // Reset form and close popup
      resetForm();
      setShowCreateProjectPopup(false);

      // Optionally redirect to project page
      router.refresh(); // Refresh to show new project
    } catch (error) {
      console.error("Error creating project:", error);
      setValidationMessage({
        type: "error",
        message: "Failed to create project. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form functionuu
  const resetForm = () => {
    setProjectTitle("");
    setProjectDescription("");
    setStartDate("");
    setEndDate("");
    setPriority("medium");
    setAssignees([]);
    setInviteUsers([]);
    setLogoLetter("P");
    setCustomizedLogo(null);
    setValidationMessage(null);
    setIsCustomizingIcon(false);
    setShowAssigneeSearch(false);
    setShowInviteSearch(false);
    dispatch(resetInvitedUsersArray());
  };

  return (
    <div
      className={`${
        showCreateProjectPopup ? "flex" : "hidden"
      } fixed justify-center items-center w-screen h-screen top-0 left-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto`}
      onClick={() => {
        resetForm();
        setShowCreateProjectPopup(false);
      }}
    >
      <div
        className="flex flex-col gap-4 min-w-[90%] max-w-[800px] max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl p-6 animate-PopUpAppear overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Create New Project{" "}
              <span className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                (under {workspaceTitle} workspace)
              </span>
            </h1>
            <p className="text-sm text-gray-400">
              Don&apos;t worry, you can update project info at project settings
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowCreateProjectPopup(false);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <IoMdClose className="text-xl text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Validation Message */}
        {validationMessage && (
          <div
            className={`p-3 rounded-lg text-sm ${
              validationMessage.type === "error"
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {validationMessage.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            {/* Project Title & Icon */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Project Icon & Title
              </label>
              <div className="flex gap-3 items-center">
                <div
                  className={`${
                    customizedLogo === null
                      ? "bg-gray-200 text-gray-500 hover:bg-gray-300"
                      : `${customizedLogo.bg} ${customizedLogo.text}`
                  } cursor-pointer border-2 border-gray-300 dark:border-gray-600 flex justify-center items-center h-12 w-12 rounded-xl text-lg font-bold transition-colors`}
                  onClick={() => setIsCustomizingIcon(!isCustomizingIcon)}
                >
                  {logoLetter || "P"}
                </div>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="flex-1 outline-none border-2 border-gray-300 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter project title"
                />
              </div>
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description{" "}
                <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={3}
                className="w-full outline-none border-2 border-gray-300 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Describe your project..."
              />
            </div>

            {/* Deadlines */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full outline-none border-2 border-gray-300 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full outline-none border-2 border-gray-300 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Priority Level
              </label>
              <div className="grid grid-cols-2 gap-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setPriority(option.value)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      priority === option.value
                        ? `${option.bg} ${option.color} border-current`
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FaExclamationTriangle className="text-sm" />
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Members */}
          <div className="space-y-4">
            {/* Assignees Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Assignees{" "}
                  <span className="text-gray-500">(Workspace Members)</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setShowAssigneeCopyLink(!showAssigneeCopyLink)
                    }
                    className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm border border-blue-300 dark:border-blue-700"
                  >
                    <FaLink className="text-sm" />
                    Copy Link
                  </button>
                  <button
                    onClick={() => setShowAssigneeSearch(!showAssigneeSearch)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    <MdAssignment className="text-sm" />
                    Search Members
                  </button>
                </div>
              </div>

              {/* Workspace Info */}

              {/* Copy Link Section for Assignees */}
              {showAssigneeCopyLink && (
                <div className="mb-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                        Assignee Invitation Link
                      </h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Share this link with workspace members to give them edit
                        access to this project
                      </p>
                    </div>
                    <button
                      onClick={copyAssigneeLink}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        copiedAssigneeLink
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {copiedAssigneeLink ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <MdContentCopy className="text-sm" />
                          Copy Link
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Assignees List */}
              {assignees.length > 0 && (
                <div className="space-y-2 mb-3">
                  {assignees.map((assignee) => (
                    <div
                      key={assignee.user_id}
                      className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8">
                          <Image
                            src={
                              assignee.photoURL ||
                              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            }
                            alt={assignee.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white text-sm">
                            {assignee.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            @{assignee.username} • Edit Access
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAssignee(assignee.user_id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <IoMdClose />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* All Workspace Members Display */}
              {showAllMembers && (
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                      All Workspace Members
                    </h4>
                    <button
                      onClick={() => setShowAllMembers(false)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      Hide
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2 border border-blue-200 dark:border-blue-800 rounded-lg p-2 bg-blue-50/50 dark:bg-blue-900/10">
                    {getAvailableWorkspaceMembers().map((member) => (
                      <div
                        key={member.uid}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                        onClick={() => handleAssigneeSelect(member)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8">
                            <Image
                              src={
                                member.photoURL ||
                                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                              }
                              alt={member.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white text-sm">
                              {member.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              @{member.username}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssigneeSelect(member);
                          }}
                          className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Assign
                        </button>
                      </div>
                    ))}
                    {getAvailableWorkspaceMembers().length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        All workspace members are already assigned
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Toggle Button for All Members */}
              {!showAllMembers && (
                <div className="mb-3">
                  <button
                    onClick={() => setShowAllMembers(true)}
                    className="w-full p-3 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
                  >
                    Show All Workspace Members (
                    {getAvailableWorkspaceMembers().length} available)
                  </button>
                </div>
              )}

              {/* Assignee Search */}
              {showAssigneeSearch && (
                <div className="border-2 border-gray-300 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Search for specific workspace members:
                  </p>
                  <UserSearchResultsForProjects
                    username={username}
                    workspaceMembersArray={workspaceMembers}
                    onUserSelect={handleAssigneeSelect}
                    excludeUsers={assignees.map((a) => a.user_id)}
                  />
                </div>
              )}
            </div>

            {/* Invite Users Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Invite Others{" "}
                  <span className="text-gray-500">(External Users)</span>
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowInviteCopyLink(!showInviteCopyLink)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm border border-green-300 dark:border-green-700"
                  >
                    <FaLink className="text-sm" />
                    Copy Link
                  </button>
                  <button
                    onClick={() => setShowInviteSearch(!showInviteSearch)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    <MdPersonAdd className="text-sm" />
                    Send Invite
                  </button>
                </div>
              </div>

              {/* Copy Link Section for External Invites */}
              {showInviteCopyLink && (
                <div className="mb-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
                        External User Invitation Links
                      </h4>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Share these links with external users to invite them
                        with specific permissions
                      </p>
                    </div>

                    {/* View Access Link */}
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          View Only Access
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Users can view project details but cannot edit
                        </p>
                      </div>
                      <button
                        onClick={() => copyInviteLink("view")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          copiedViewLink
                            ? "bg-green-500 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {copiedViewLink ? (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <MdContentCopy className="text-sm" />
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>

                    {/* Edit Access Link */}
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700">
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          Edit Access
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Users can view and edit project details
                        </p>
                      </div>
                      <button
                        onClick={() => copyInviteLink("edit")}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          copiedEditLink
                            ? "bg-green-500 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {copiedEditLink ? (
                          <>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <MdContentCopy className="text-sm" />
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Invited Users List */}
              {inviteUsers.length > 0 && (
                <div className="space-y-2 mb-3">
                  {inviteUsers.map((user) => (
                    <div
                      key={user.user_id}
                      className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8">
                          <Image
                            src={
                              user.photoURL ||
                              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            }
                            alt={user.name}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white text-sm">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            @{user.username} •{" "}
                            {user.role === "view" ? "View Only" : "Edit Access"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          onChange={(e) => {
                            setInviteUsers(
                              inviteUsers.map((u) =>
                                u.user_id === user.user_id
                                  ? { ...u, role: e.target.value }
                                  : u
                              )
                            );
                          }}
                          className="text-xs border rounded px-2 py-1 bg-white dark:bg-gray-600"
                        >
                          {roleOptions.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeInvitedUser(user.user_id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <IoMdClose />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Invite Search */}
              {showInviteSearch && (
                <div className="border-2 border-gray-300 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Search and invite users with access level:
                  </p>
                  <UserSearchResults
                    username={username}
                    onUserSelect={(user, role) =>
                      handleInviteUserWithRole(user, role)
                    }
                    showRoleSelector={true}
                    roleOptions={roleOptions}
                    excludeUsers={[
                      ...assignees.map((a) => a.user_id),
                      ...inviteUsers.map((u) => u.user_id),
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={() => {
              resetForm();
              setShowCreateProjectPopup(false);
            }}
            className="px-6 py-2 border-2 border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateProject}
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isLoading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </div>
            ) : (
              "Create Project"
            )}
          </button>
        </div>

        {/* Icon Customization Popup */}
        {isCustomizingIcon && (
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 z-60 border-2 border-gray-200 dark:border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Logo Letter:
                </label>
                <input
                  type="text"
                  value={logoLetter}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLogoLetter(value.length > 1 ? value[0] : value);
                  }}
                  className="w-12 h-12 text-center font-bold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white"
                  maxLength={1}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Background Color:
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {ColorsArray.map((color, index) => (
                    <button
                      key={index}
                      className={`w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center font-bold text-xs transition-all hover:scale-110 ${
                        color
                          ? `${color.bg} ${color.textColor}`
                          : "bg-transparent text-gray-400"
                      }`}
                      onClick={() => setCustomizedLogo(color)}
                    >
                      {color ? logoLetter : <MdOutlineDoNotDisturbAlt />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsCustomizingIcon(false)}
                className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProjectPopup;
