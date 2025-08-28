import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetInvitedUsersArray } from "@/lib/features/slice";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";
import UserSearchResults from "./userSearchResults";
import { generateCustomCode } from "./getCustomCode";
import { validateWorkspaceTitle } from "@/lib/utils/CreateWorkSpacePopup";
import CreateWorkspace, {
  updateWorkspaceinUsers,
} from "@/Firebase Functions/CreateWorkspace";
import { PostNotifications } from "@/Firebase Functions/GetAndPostNotifications";
import { createDateInfo } from "@/lib/utils/CreateDateInfo";
import { useRouter } from "next/navigation";
import { ColorsArray } from "@/lib/utils/LogoColorsArray";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { useAuthContext } from "@/context/AuthContext";

const CreateWorkSpacePopup = ({
  createPopupNum,
  currentUserUsername,
  currentUserFullName,
  currentUserid,
  workspacearray,
  currentUserEmail,
  currentUserphotoUrl,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const invitedUsers = useSelector((state) => state.invitedUsers.invitedUsers);

  const { user, setUser } = useAuthContext();
  const { currentWorkspace, setCurrentWorkspace } = useWorkspaceContext();

  // UI State
  const [showCreateWorkspacePopup, setShowCreateWorkspacePopup] =
    useState(false);
  const [isCustomizingIcon, setIsCustomizingIcon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [workspaceTitle, setWorkspaceTitle] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [LogoLetter, setLogoLetter] = useState("W");
  const [customizedLogo, setCustomizedLogo] = useState({
    textColor: "",
    bg: "",
  });

  // Validation and Error State
  const [fillAllTheFields, setFillAllTheFields] = useState(null);
  const [workspaceMessage, setWorkspaceMessage] = useState(null);

  // Show popup when createPopupNum changes
  useEffect(() => {
    if (createPopupNum > 0) {
      setShowCreateWorkspacePopup(true);
    }
  }, [createPopupNum]);

  // Helper functions
  const resetForm = () => {
    setWorkspaceTitle("");
    setWorkspaceDescription("");
    setIsPrivate(false);
    setLogoLetter("W");
    setCustomizedLogo(null);
    setFillAllTheFields(null);
    setWorkspaceMessage(null);
    setIsCustomizingIcon(false);
    setShowCreateWorkspacePopup(false);
  };

  const validateForm = () => {
    if (workspaceTitle === "" && LogoLetter === "") {
      setFillAllTheFields({
        message: "Please fill the fields",
        status: "error",
      });
      return false;
    } else if (workspaceTitle === "" && LogoLetter !== "") {
      setFillAllTheFields({ message: "Please add a title", status: "error" });
      return false;
    } else if (workspaceTitle !== "" && LogoLetter === "") {
      setFillAllTheFields({ message: "Please fill the logo", status: "error" });
      return false;
    }

    if (!validateWorkspaceTitle(workspaceTitle, setWorkspaceMessage)) {
      setFillAllTheFields({
        message: "Invalid workspace title",
        status: "error",
      });
      return false;
    }

    setFillAllTheFields(null);
    return true;
  };

  const sendInvitationNotifications = async (workspaceObj, membersList) => {
    const notificationID = generateCustomCode(14);
    const dateInfo = createDateInfo();
    const hoursLeftMsg = "This invitation will expire after 24 hours.";

    for (let i = 0; i < invitedUsers.length; i++) {
      try {
        await PostNotifications(membersList[i].username, notificationID, {
          Body: hoursLeftMsg,
          isRead: false,
          isSeen: false,
          Title: `${currentUserFullName} (${currentUserUsername}) has invited you to join ${workspaceTitle}`,
          Time: dateInfo.time,
          uid: notificationID,
          Type: "invitation",
          invitationExpirationDate: dateInfo.expirationDate,
          isInvitationAccepted: null,
          isInvitationExpired: false,
          workSpace: workspaceObj,
        });
        console.log(
          `Successfully sent invitation to ${membersList[i].username}`
        );
      } catch (err) {
        console.log(
          `Failed to send invitation to ${membersList[i].username}`,
          err
        );
      }
    }
  };

  const handleCreateWorkspace = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const workspaceID = generateCustomCode(14);
      const membersList = [
        ...invitedUsers,
        {
          uid: currentUserid,
          isAdmin: true,
          isInvitationAccepted: true,
          joinedAt: new Date(),
        },
      ];

      const workspaceDoc = {
        workspaceTitle,
        workspaceDescription,
        workspaceID,
        isPrivate,
        logo: {
          text: LogoLetter,
          bg: customizedLogo?.bg,
          textColor: customizedLogo?.textColor,
        },
        admin: [currentUserid],
        creator: currentUserid,
        members: membersList,
        projects: [],
      };

      const res = await CreateWorkspace(workspaceDoc);

      if (res == workspaceID) {
        console.log("Workspace Created Successfully");

        // Send invitation notifications
        if (invitedUsers.length > 0) {
          await sendInvitationNotifications(workspaceDoc, membersList);
        }

        // Update user's workspace array
        membersList.map(async (member) => {
          await updateWorkspaceinUsers(member.uid, workspaceID);
        });

        console.log("Workspace added to user");
        dispatch(resetInvitedUsersArray());
        setUser((prevUser) => ({
          ...prevUser,
          workspaces: [...prevUser.workspaces, newWorkspace],
        }));
        setCurrentWorkspace(workspaceDoc);
        router.push(`/Workspaces/${workspaceDoc.workspaceID}`);
        resetForm();
        //!getting problem
      }
    } catch (err) {
      console.error("Error creating workspace", err);
      setWorkspaceMessage({
        type: "error",
        message: "Failed to create workspace",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`${
          showCreateWorkspacePopup ? "flex" : "hidden"
        } absolute justify-center items-center w-screen h-screen top-0 left-0 bg-black/50  backdrop-blur-sm z-20 overflow-x-hidden`}
        onClick={() => {
          resetForm();
        }}
      >
        <div
          className="flex flex-row justify-between gap-2 min-w-[40%] min-h-[50%] bg-[#dbdbdb] dark:bg-gray-700 rounded-3xl z-[21] p-4 animate-PopUpAppear"
          onClick={(e) => {
            e.stopPropagation();
            setIsCustomizingIcon(false);

            if (LogoLetter === "") {
              setLogoLetter("W");
            }
          }}
        >
          <div className={`mx-5 ${!isPrivate && "w-full"} transition-all`}>
            <div className="text-xl mt-1">
              <h1 className="font-bold">Create Workspace</h1>
              <p className="text-gray-400 text-xs font-normal">
                Create a workspace for your team to collaborate and work
                together
              </p>
            </div>
            <div className="flex flex-col gap-2 my-4">
              <label htmlFor="workspaceTitle" className="text-sm font-bold ">
                Icon & title{" "}
                <span
                  className={`${
                    fillAllTheFields !== null ? "text-red-500" : "hidden"
                  }`}
                >
                  ({fillAllTheFields?.message})
                </span>
              </label>
              <div className="flex flex-row gap-2 justify-start items-center w-full">
                <div
                  className={`${
                    customizedLogo === null
                      ? "hover:bg-gray-300 text-gray-400"
                      : `text-${customizedLogo.textColor} ${customizedLogo.bg}`
                  } cursor-pointer icon border-2 flex justify-center rounded-xl items-center h-10 w-10 text-lg border-gray-400 dark:border-gray-500`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCustomizingIcon(!isCustomizingIcon);
                  }}
                >
                  <span className="font-bold">{LogoLetter}</span>
                </div>
                <input
                  type="text"
                  id="workspaceTitle"
                  value={workspaceTitle}
                  onChange={(e) => {
                    setWorkspaceTitle(e.target.value);
                  }}
                  className="outline-thm-clr-1 rounded-xl p-3 border-2 w-[92%] bg-gray-100 dark:border-gray-500 dark:bg-gray-500 dark:placeholder:text-gray-100 placeholder:text-xs text-sm"
                  placeholder="Add a title"
                />
              </div>
              {workspaceMessage !== null ? (
                <div
                  className={`${
                    workspaceMessage.type === "error"
                      ? "text-red-500"
                      : "text-green-500"
                  } text-end text-xs`}
                >
                  {workspaceMessage.message}
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-col gap-2 my-4">
              <label
                htmlFor="workspaceDescription"
                className="text-sm font-bold "
              >
                Description{" "}
                <span className="font-semibold text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={workspaceDescription}
                onChange={(e) => {
                  setWorkspaceDescription(e.target.value);
                }}
                id="workspaceDescription"
                className="outline-thm-clr-1 rounded-xl p-3 border-2 bg-gray-100 dark:border-gray-500 dark:bg-gray-500 placeholder:text-xs dark:placeholder:text-gray-100 text-sm"
                placeholder="Add a description"
              />
            </div>
            <div className="flex flex-row justify-between items-center gap-2 my-4">
              <div>
                <label htmlFor="" className=" text-sm font-bold ">
                  Make Private
                </label>
                <div className="flex flex-row gap-2 justify-start items-center w-full">
                  <span className="text-xs text-gray-400">
                    Private workspaces are only visible to invited members
                  </span>
                </div>
              </div>
              <div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => {
                      setIsPrivate(!isPrivate);
                    }}
                  />
                  <span>
                    <em></em>
                    <strong></strong>
                  </span>
                </label>
              </div>
            </div>
            <div className="flex flex-row justify-between gap-2 my-5">
              <button
                className="bg-gray-400 dark:bg-gray-900 dark:hover:bg-black hover:bg-gray-500 transition-all text-white rounded-lg px-4 py-2 text-sm font-bold"
                onClick={() => {
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                className={` ${
                  isLoading
                    ? "bg-gray-500 text-white"
                    : "bg-thm-clr-1 hover:bg-thm-clr-2 hover:text-black text-white"
                }  flex justify-center items-center gap-2 transition-all rounded-lg px-4 py-2 text-sm font-bold`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isLoading) {
                    handleCreateWorkspace();
                  }
                }}
              >
                {isLoading && (
                  <div className="loader border-gray-500/25 w-4 h-4 border-2"></div>
                )}
                Create Workspace
              </button>
            </div>
          </div>
          {isPrivate && (
            <>
              <div className="w-[2px] bg-gray-300"></div>
              <div className="m-2 flex flex-col items-start ">
                {/* animation-widthIncreasing */}
                <h2 className="font-bold my-1">Invite users</h2>
                <UserSearchResults username={currentUserUsername} />
              </div>
            </>
          )}
          <div
            className={`${
              isCustomizingIcon ? "flex" : "hidden"
            } flex-col gap-3 fixed top-[43.5vh] left-[18vw] bg-slate-200 shadow-md min-h-[15%] justify w-[220px] rounded-xl p-2`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex flex-row gap-2 items-center">
              <label htmlFor="logoLetter">
                <h1 className="text-xs font-bold my-1 text-gray-500">Logo:</h1>
              </label>
              <input
                type="text"
                value={LogoLetter}
                id="logoLetter"
                onChange={(e) => {
                  if (e.target.value.length > 1) {
                    setLogoLetter(e.target.value[0]);
                  } else {
                    setLogoLetter(e.target.value);
                  }
                }}
                className="rounded-xl font-bold p-2 border-2 bg-slate-100 outline-thm-clr-1 placeholder:text-xs my-1 w-10 text-center text-sm text-gray-500"
              />
            </div>
            <div className="bgcolors">
              <h2 className="text-xs font-bold my-1 text-gray-500">
                Background color
              </h2>
              <div className="grid grid-cols-7 grid-rows-2 gap-2">
                {ColorsArray.map((colors, index) => (
                  <span
                    key={index}
                    className={`${
                      colors !== null ? colors.bg : "bg-transparent"
                    } ${
                      colors !== null
                        ? `text-${colors.textColor}`
                        : "text-gray-400 border-2 border-gray-300"
                    } cursor-pointer hover:border-2 hover:border-gray-400 font-semibold text-center flex items-center justify-center text-xs rounded-lg  w-6 h-6`}
                    onClick={() => {
                      setCustomizedLogo(colors);
                    }}
                  >
                    <span>
                      {colors !== null ? (
                        LogoLetter
                      ) : (
                        <MdOutlineDoNotDisturbAlt />
                      )}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateWorkSpacePopup;
