import CreateWorkspace, {
  updateWorkspaceinUsers,
} from "@/Firebase Functions/CreateWorkspace";
import isUserAuthenticated from "@/Firebase Functions/isUserAuthenticated";
import useDebounce from "@/Firebase Functions/useDebounce";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged } from "@firebase/auth";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { GrStatusInfoSmall } from "react-icons/gr";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";
import UserSearchResults, {
  UserSearchResultsForProjects,
} from "./userSearchResults";
import { generateCustomCode } from "./getCustomCode";
import { useSelector, useDispatch } from "react-redux";
import { PostNotifications } from "@/Firebase Functions/GetAndPostNotifications";
import Link from "next/link";
import { resetInvitedUsersArray } from "@/lib/features/slice";
import createProject from "@/Firebase Functions/createProject";

const AddProjectPopup = ({
  activateNum,
  username,
  ProjectsArray,
  workspaceID,
  workspaceMembers,
  workspaceTitle,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [members, setMembers] = useState([]);

  console.log(
    activateNum,
    username,
    ProjectsArray,
    workspaceID,
    workspaceMembers
  );

  const [showCreateWorkspacePopup, setShowCreateWorkspacePopup] =
    useState(false);

  const [projectTitle, setprojectTitle] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCustomizingIcon, setIsCustomizingIcon] = useState(false);
  const [LogoLetter, setLogoLetter] = useState("P");
  const [customizedLogo, setCustomizedLogo] = useState(null);

  const [fillAllTheFields, setFillAllTheFields] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uid, setUid] = useState("");
  // const [user, setUser] = useState(null);
  const [projectsArray, setprojectsArray] = useState([]);

  useEffect(() => {
    setprojectsArray(ProjectsArray);
  }, [ProjectsArray]);

  const [workspaceMessage, setWorkspaceMessage] = useState(null);

  const ColorsArray = [
    null,
    { text: "white", bg: "bg-black" },
    { text: "white", bg: "bg-red-500" },
    { text: "white", bg: "bg-green-500" },
    { text: "white", bg: "bg-purple-500" },
    { text: "white", bg: "bg-yellow-500" },
    { text: "white", bg: "bg-cyan-500" },
    { text: "white", bg: "bg-blue-500" },
    { text: "white", bg: "bg-orange-500" },
  ];

  useEffect(() => {
    setprojectsArray(projectsArray);
    console.log(projectsArray);
  }, [projectsArray]);

  useEffect(() => {
    if (activateNum > 0) {
      setShowCreateWorkspacePopup(true);
    }
  }, [activateNum]);

  const handleclick = () => {
    const projectid = generateCustomCode(7);
    if (validateprojectTitle(projectTitle)) {
      setIsLoading(true);
      const projectObject = {
        projectTitle,
        projectDescription: workspaceDescription,
        projectID: projectid,
        isPrivate,
        projectLogoLetter: LogoLetter,
        customizedProjectLogo: customizedLogo,
        url: `/Workspaces/${workspaceTitle}/${workspaceID}/p/${projectTitle}/${projectid}/${username}`,
        // members: members,
      };

      createProject(workspaceID, projectid, projectObject)
        .then((res) => {
          console.log("Project Created");
          setIsLoading(false);
          setShowCreateWorkspacePopup(false);
        })
        .catch((err) => {
          console.log("error in creating project", err);
          setIsLoading(false);
          setShowCreateWorkspacePopup(false);
        });
    }
  };

  useEffect(() => {}, []);

  function validateprojectTitle(projectTitle) {
    if (projectTitle.length < 2 || projectTitle.length > 15) {
      setWorkspaceMessage({
        type: "error",
        message: "Project title must be between 2 and 15 characters.",
      });
      return false;
    }
    if (projectTitle.startsWith("_")) {
      setWorkspaceMessage({
        type: "error",
        message: "Project title cannot start with an (_).",
      });
      return false;
    }
    if (projectTitle.startsWith("-")) {
      setWorkspaceMessage({
        type: "error",
        message: "Project title cannot start with an (-).",
      });
      return false;
    }
    const projectTitleRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/;

    if (!projectTitleRegex.test(projectTitle)) {
      setWorkspaceMessage({
        type: "error",
        message:
          "Project title can only contain letters, numbers, underscores (_), and hyphens (-).",
      });
      return false;
    }

    setWorkspaceMessage({
      type: "success",
      message: "Project title is valid.",
    });
    return true;
  }

  useEffect(() => {
    validateprojectTitle(projectTitle);
  }, [projectTitle]);

  return (
    <>
      <div
        className={`${
          showCreateWorkspacePopup ? "flex" : "hidden"
        } absolute justify-center items-center w-screen h-screen top-0 left-0 bg-black/50  backdrop-blur-sm z-20 overflow-x-hidden`}
        onClick={() => {
          setShowCreateWorkspacePopup(false);
          setIsCustomizingIcon(false);
          setCustomizedLogo(null);
          setFillAllTheFields(null);
          setIsPrivate(false);
          if (LogoLetter === "") {
            setLogoLetter("P");
          }
        }}
      >
        <div
          className="flex flex-row justify-between gap-2 min-w-[40%] min-h-[50%] bg-[#dbdbdb] dark:bg-gray-700 rounded-3xl z-[21] p-4 animate-PopUpAppear"
          onClick={(e) => {
            e.stopPropagation();
            setIsCustomizingIcon(false);

            if (LogoLetter === "") {
              setLogoLetter("P");
            }
          }}
        >
          <div className={`mx-5 ${!isPrivate && "w-full"} transition-all`}>
            <div className="text-xl mt-1">
              <h1 className="font-bold">Create Project</h1>
              {/* <p className="text-gray-400 text-xs font-normal">
                Create a project for your team to collaborate and work
                together
              </p> */}
            </div>
            <div className="flex flex-col gap-2 my-4">
              <label htmlFor="projectTitle" className="text-sm font-bold ">
                Icon & project title{" "}
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
                      : `text-${customizedLogo.text} ${customizedLogo.bg}`
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
                  id="projectTitle"
                  value={projectTitle}
                  onChange={(e) => {
                    setprojectTitle(e.target.value);
                  }}
                  className="outline-thm-clr-1 rounded-xl p-3 border-2 w-[92%] bg-gray-100 dark:border-gray-500 dark:bg-gray-500 dark:placeholder:text-gray-100 placeholder:text-xs text-sm"
                  placeholder="Add a project title"
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
                Project Description{" "}
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
                    Private projects are only visible to invited members
                  </span>
                </div>
              </div>
              <div>
                <label class="switch">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => {
                      // console.log(e);
                      // console.log(isPrivate);
                      setIsPrivate(!isPrivate);
                      // console.log(isPrivate)
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
                  setShowCreateWorkspacePopup(false);
                  setIsCustomizingIcon(false);
                  setCustomizedLogo(null);
                  setFillAllTheFields(null);
                  setprojectTitle("");
                  setWorkspaceDescription("");
                  setIsPrivate(false);
                  if (LogoLetter === "") {
                    setLogoLetter("P");
                  }
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
                    handleclick();
                  }
                }}
              >
                {isLoading && (
                  <>
                    <div className="loader border-gray-500/25 w-4 h-4 border-2"></div>
                  </>
                )}
                Create Project
              </button>
            </div>
          </div>
          {isPrivate && (
            <>
              <div className="w-[2px] bg-gray-300"></div>
              <div className="m-2 flex flex-col items-start ">
                {" "}
                {/*animation-widthIncreasing */}
                <h2 className="font-bold my-1">Invite users</h2>
                <UserSearchResultsForProjects
                  username={username}
                  workspaceMembersArray={workspaceMembers}
                />
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
                        ? `text-${colors.text}`
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

export default AddProjectPopup;
