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
import UserSearchResults from "./userSearchResults";
import { generateCustomCode } from "./getCustomCode";
import { useSelector, useDispatch } from "react-redux";
import { PostNotifications } from "@/Firebase Functions/GetAndPostNotifications";
import Link from "next/link";
import { resetInvitedUsersArray } from "@/lib/features/slice";

const CreateWorkSpacePopup = ({
  createPopupNum,
  uname,
  name,
  uniqID,
  workspacearray,
  email,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const invitedUsers = useSelector((state) => state.invitedUsers.invitedUsers);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (invitedUsers.length > 0) {
      console.log("invitedUsers", invitedUsers);
      // setMembers(invitedUsers);
    }
  }, [invitedUsers]);

  const [showCreateWorkspacePopup, setShowCreateWorkspacePopup] =
    useState(false);

  const [workspaceTitle, setWorkspaceTitle] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCustomizingIcon, setIsCustomizingIcon] = useState(false);
  const [LogoLetter, setLogoLetter] = useState("W");
  const [customizedLogo, setCustomizedLogo] = useState(null);

  const [fillAllTheFields, setFillAllTheFields] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [uid, setUid] = useState("");
  // const [user, setUser] = useState(null);
  const [WorkspaceArray, setWorkspaceArray] = useState([]);

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
    setWorkspaceArray(workspacearray);
    console.log(workspacearray);
  }, [workspacearray]);

  useEffect(() => {
    if (createPopupNum > 0) {
      setShowCreateWorkspacePopup(true);
    }
  }, [createPopupNum]);

  useEffect(() => {
    if (uname !== undefined) setUsername(uname);
  }, [uname]);

  useEffect(() => {
    setUid(uniqID);
  }, [uniqID]);

  const handleclick = () => {
    if (workspaceTitle === "" && LogoLetter === "") {
      setFillAllTheFields({
        message: "Please fill the fields",
        status: "error",
      });
    } else if (workspaceTitle === "" && LogoLetter !== "") {
      setFillAllTheFields({
        message: "Please add a title",
        status: "error",
      });
    } else if (workspaceTitle !== "" && LogoLetter === "") {
      setFillAllTheFields({
        message: "Please fill the logo",
        status: "error",
      });
    } else {
      setFillAllTheFields(null);

      if (validateWorkspaceTitle(workspaceTitle)) {
        setIsLoading(true);
        setMembers([
          ...invitedUsers,
          {
            username: username,
            uid: uid,
            isAdmin: true,
            isPendingInvitation: false,
          },
        ]);
      }
    }
  };

  useEffect(() => {
    console.log("members: ", members);
    if (members.length == invitedUsers.length + 1) {
      const workspaceID = generateCustomCode(14);
      console.log(workspaceID);
      const object = {
        // This is the object that will be added to the workspaces collection
        workspaceTitle,
        workspaceDescription,
        workspaceID,
        isPrivate,
        LogoLetter,
        customizedLogo,
        members,
        url: `/Workspaces/${workspaceTitle}/${workspaceID}/`,
        //!members will come soon
      };
      console.log(object);
      CreateWorkspace(workspaceID, object)
        .then((res) => {
          setIsLoading(true);
          if (res == workspaceID) {
            console.log("Workspace Created Successfully");
            const NewWorkspace = {
              // This is the object that will be added to the user's workspaces array
              workspaceTitle,
              workspaceID,
              isPrivate: isPrivate,
              LogoLetter: LogoLetter,
              customizedLogo: customizedLogo,
              members: members,
              url: `/Workspaces/${workspaceTitle}/${workspaceID}/${username}`,
            };
            // WorkspaceArray.push(NewWorkspace);

            const workspaceArrayUpdated = [...workspacearray];
            workspaceArrayUpdated.push(NewWorkspace); 

            const notificationID = generateCustomCode(14);

            function dateFunction() {
              const d = new Date();

              const date = d.getDate();
              const month =
                d.getMonth() + 1 == 1
                  ? "Jan"
                  : d.getMonth() + 1 == 2
                  ? "Feb"
                  : d.getMonth() + 1 == 3
                  ? "Mar"
                  : d.getMonth() + 1 == 4
                  ? "Apr"
                  : d.getMonth() + 1 == 5
                  ? "May"
                  : d.getMonth() + 1 == 6
                  ? "Jun"
                  : d.getMonth() + 1 == 7
                  ? "Jul"
                  : d.getMonth() + 1 == 8
                  ? "Aug"
                  : d.getMonth() + 1 == 9
                  ? "Sep"
                  : d.getMonth() + 1 == 10
                  ? "Oct"
                  : d.getMonth() + 1 == 11
                  ? "Nov"
                  : "Dec";
              const year = d.getFullYear();
              const hours = d.getHours();
              const minutes =
                d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();

              return {
                expirationDate: {
                  date: date,
                  month: d.getMonth() + 1,
                  year: year,
                  hours: hours,
                  minutes: minutes,
                },
                time: `${hours}:${minutes}     ${date} ${month}, ${year}`,
              };
            }
            function hoursLeft() {
              const newDate = new Date();
              if (
                newDate.getDate() == dateFunction().expirationDate.date &&
                newDate.getMonth() + 1 == dateFunction().expirationDate.month &&
                newDate.getFullYear() == dateFunction().expirationDate.year
              ) {
                return `This invitation will expire after 24 hours.`;
              } else if (
                newDate.getDate() > dateFunction().expirationDate.date ||
                newDate.getMonth() + 1 > dateFunction().expirationDate.month ||
                newDate.getFullYear() > dateFunction().expirationDate.year
              ) {
                return "";
              }
            }

            for (let i = 0; i < invitedUsers.length; i++) {
              PostNotifications(members[i].username, notificationID, {
                Body: `${hoursLeft()}`,
                isRead: false,
                isSeen: false,
                Title: `${name} (${username}) has invited you to join ${workspaceTitle}`,
                Time: dateFunction().time,
                uid: notificationID,
                Type: "invitation",
                invitationExpirationDate: dateFunction().expirationDate,
                isInvitationAccepted: null,
                isInvitationExpired: false,
                workSpace: object,
              })
                .then(() => {
                  console.log(
                    `Successfully send invitation to ${members[i].username}`
                  );
                })
                .catch((err) => {
                  console.log(
                    `failed to send invitation to ${members[i].username}`,
                    err
                  );
                });
            }

            updateWorkspaceinUsers(username, [...workspaceArrayUpdated])
              .then(() => {
                console.log("Workspace added to user");
                setIsLoading(false);

                setIsCustomizingIcon(false);
                setShowCreateWorkspacePopup(false);
                setWorkspaceTitle("");
                setWorkspaceDescription("");
                setIsPrivate(false);
                setLogoLetter("W");
                setCustomizedLogo(null);
                setFillAllTheFields(null);
                setMembers([]);
              })
              .catch((err) => {
                console.error("Error adding workspace to user", err);
                setIsLoading(false);

                setIsCustomizingIcon(false);
                // setShowCreateWorkspacePopup(false);
                setWorkspaceTitle("");
                setWorkspaceDescription("");
                setIsPrivate(false);
                setLogoLetter("W");
                setCustomizedLogo(null);
                setFillAllTheFields(null);
                setMembers([]);
              });
          }
          dispatch(resetInvitedUsersArray());
        })
        .catch((err) => {
          setIsLoading(true);
          console.error("Error creating workspace", err);
        });
    }
  }, [members]);

  function validateWorkspaceTitle(workspaceTitle) {
    if (workspaceTitle.length < 2 || workspaceTitle.length > 15) {
      setWorkspaceMessage({
        type: "error",
        message: "Workspace title must be between 2 and 15 characters.",
      });
      return false;
    }
    if (workspaceTitle.startsWith("_")) {
      setWorkspaceMessage({
        type: "error",
        message: "Workspace title cannot start with an (_).",
      });
      return false;
    }
    if (workspaceTitle.startsWith("-")) {
      setWorkspaceMessage({
        type: "error",
        message: "Workspace title cannot start with an (-).",
      });
      return false;
    }
    const workspaceTitleRegex = /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/;

    if (!workspaceTitleRegex.test(workspaceTitle)) {
      setWorkspaceMessage({
        type: "error",
        message:
          "Workspace title can only contain letters, numbers, underscores (_), and hyphens (-).",
      });
      return false;
    }

    setWorkspaceMessage({
      type: "success",
      message: "Workspace title is valid.",
    });
    return true;
  }

  useEffect(() => {
    validateWorkspaceTitle(workspaceTitle);
  }, [workspaceTitle]);

  return (
    <>
      <div
        className={`${
          showCreateWorkspacePopup ? "flex" : "hidden"
        } absolute justify-center items-center w-screen h-screen top-0 left-0 bg-black/50 backdrop-blur-sm z-20 overflow-x-hidden`}
        onClick={() => {
          setShowCreateWorkspacePopup(false);
          setIsCustomizingIcon(false);
          setCustomizedLogo(null);
          setFillAllTheFields(null);
          setIsPrivate(false);
          if (LogoLetter === "") {
            setLogoLetter("W");
          }
        }}
      >
        <div
          className="flex flex-row justify-between gap-2 min-w-[40%] min-h-[50%] bg-[#dbdbdb] rounded-3xl z-[21] p-4 animate-PopUpAppear"
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
                      : `text-${customizedLogo.text} ${customizedLogo.bg}`
                  } cursor-pointer icon border-2 flex justify-center rounded-xl items-center h-10 w-10 text-lg border-gray-400`}
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
                  className="outline-thm-clr-1 rounded-xl p-3 border-2 w-[92%] bg-gray-100 placeholder:text-xs text-sm"
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
                className="outline-thm-clr-1 rounded-xl p-3 border-2 bg-gray-100 placeholder:text-xs text-sm"
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
                className="bg-gray-400 hover:bg-gray-500 transition-all text-white rounded-lg px-4 py-2 text-sm font-bold"
                onClick={() => {
                  setShowCreateWorkspacePopup(false);
                  setIsCustomizingIcon(false);
                  setCustomizedLogo(null);
                  setFillAllTheFields(null);
                  setWorkspaceTitle("");
                  setWorkspaceDescription("");
                  setIsPrivate(false);
                  if (LogoLetter === "") {
                    setLogoLetter("W");
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
                Create Workspace
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
                <UserSearchResults username={username} />
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

export default CreateWorkSpacePopup;
