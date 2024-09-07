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

const CreateWorkSpacePopup = ({
  createPopupNum,
  uname,
  uniqID,
  workspacearray,
  email,
}) => {
  const router = useRouter();
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

  useEffect(() => {
    setWorkspaceArray(workspacearray);
    console.log(workspacearray);
  }, [workspacearray]);

  const [members, setMembers] = useState([]);
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
      setIsLoading(true);

      if (validateWorkspaceTitle(workspaceTitle)) {
        members.push({
          username: username,
          uid: uid,
          isAdmin: true,
          email: email,
        });
        const workspaceID = Math.floor(
          Math.random() * 1000000000000000
        ).toString();
        console.log(workspaceID);

        const object = {
          workspaceTitle,
          workspaceDescription,
          isPrivate,
          LogoLetter,
          customizedLogo,
          members,
          url: `/Workspaces/${workspaceTitle}/${workspaceID}/${username}`,
          //!members will come soon
        };
        console.log(object);

        CreateWorkspace(workspaceID, object)
          .then((res) => {
            setIsLoading(true);
            if (res == workspaceID) {
              console.log("Workspace Created Successfully");
              WorkspaceArray.push({
                title: workspaceTitle,
                id: workspaceID,
                LogoLetter: LogoLetter,
                customizedLogo: customizedLogo,
                isPrivate: isPrivate,
                members: members,
                url: `/Workspaces/${workspaceTitle}/${workspaceID}/${username}`,
              });

              updateWorkspaceinUsers(username, [...WorkspaceArray])
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
          })
          .catch((err) => {
            setIsLoading(true);
            console.error("Error creating workspace", err);
          });
      }
    }
  };

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
          if (LogoLetter === "") {
            setLogoLetter("W");
          }
        }}
      >
        <div
          className="w-[40%] min-h-[50%] bg-[#dbdbdb] rounded-3xl z-[21] p-4 animate-PopUpAppear"
          onClick={(e) => {
            e.stopPropagation();
            setIsCustomizingIcon(false);
            if (LogoLetter === "") {
              setLogoLetter("W");
            }
          }}
        >
          <div className="mx-5">
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
                    Private workspaces are only visible to members
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
                {[
                  null,
                  { text: "white", bg: "bg-black" },
                  { text: "white", bg: "bg-red-500" },
                  { text: "white", bg: "bg-green-500" },
                  { text: "white", bg: "bg-purple-500" },
                  { text: "white", bg: "bg-yellow-500" },
                  { text: "white", bg: "bg-cyan-500" },
                  { text: "white", bg: "bg-blue-500" },
                  { text: "white", bg: "bg-orange-500" },
                ].map((colors, index) => (
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
