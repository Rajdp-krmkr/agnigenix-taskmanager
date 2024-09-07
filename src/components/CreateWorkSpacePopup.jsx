import React, { useState, useEffect } from "react";
import { GrStatusInfoSmall } from "react-icons/gr";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";

const CreateWorkSpacePopup = ({ createPopupNum }) => {
  const [showCreateWorkspacePopup, setShowCreateWorkspacePopup] =
    useState(false);

  const [workspaceTitle, setWorkspaceTitle] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCustomizingIcon, setIsCustomizingIcon] = useState(false);
  const [LogoLetter, setLogoLetter] = useState("W");
  const [customizedLogo, setCustomizedLogo] = useState(null);

  const [fillAllTheFields, setFillAllTheFields] = useState(null);
  useEffect(() => {
    if (createPopupNum > 0) {
      setShowCreateWorkspacePopup(true);
    }
  }, [createPopupNum]);

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

      console.log({
        workspaceTitle,
        workspaceDescription,
        isPrivate,
        LogoLetter,
        customizedLogo,
      });
    }
  };
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
          className=" min-w-[40%] min-h-[50%] bg-[#dbdbdb] rounded-3xl z-[21] p-4 animate-PopUpAppear"
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
                      : `text-${customizedLogo.text} bg-${customizedLogo.bg}`
                  } cursor-pointer icon border-2 flex justify-center rounded-xl items-center h-10 w-10 text-lg  border-gray-400`}
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
                    onChange={() => {
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
                  if (LogoLetter === "") {
                    setLogoLetter("W");
                  }
                }}
              >
                Cancel
              </button>
              <button
                className="bg-thm-clr-1 hover:bg-thm-clr-2 hover:text-black transition-all text-white rounded-lg px-4 py-2 text-sm font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  handleclick();
                }}
              >
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
