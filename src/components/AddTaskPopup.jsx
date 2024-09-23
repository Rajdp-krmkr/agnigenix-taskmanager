import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LuPlusCircle } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import AddTask from "@/Firebase Functions/AddUpdateFetchTask";
import { generateCustomCode } from "./getCustomCode";

const AddTaskPopup = ({ addTaskPopupNum, username }) => {
  const [OpenPopup, setOpenPopup] = useState(false);
  useEffect(() => {
    if (addTaskPopupNum > 0) {
      setOpenPopup(true);
    }
  }, [addTaskPopupNum]);

  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [taskType, setTaskType] = useState(null);
  const [taskDate, setTaskDate] = useState(null);
  const [taskPriority, setTaskPriority] = useState(null);
  const [taskTag, setTaskTag] = useState("");
  const [taskTagArray, setTaskTagArray] = useState([]);

  const [taskTypePopup, setTaskTypePopup] = useState(false);
  const [taskDatePopup, setTaskDatePopup] = useState(false);
  const [taskPriorityPopup, setTaskPriorityPopup] = useState(false);
  const [taskTagPopup, setTaskTagPopup] = useState(false);
  const [taskdescription, setTaskDescription] = useState("");
  const [addTaskDescription, setAddTaskDescription] = useState(false);

  const btnsArray = [
    {
      title: "Type",
      taskfeature: taskType,
      setTaskFeature: setTaskType,
      popup: taskTypePopup,
      setPopup: setTaskTypePopup,
      popupContent: [
        { title: "Design" },
        { title: "Management" },
        { title: "Frontend" },
        { title: "Backend" },
        { title: "Frontend" },
        { title: "Frontend" },
        { title: "Frontend" },
      ],
    },
    {
      title: "Date",
      taskfeature: taskDate,
      setTaskFeature: setTaskDate,
      popup: taskDatePopup,
      setPopup: setTaskDatePopup,
      popupContent: [
        { title: "Design" },
        { title: "Management" },
        { title: "Frontend" },
        { title: "Backend" },
        { title: "Frontend" },
        { title: "Frontend" },
        { title: "Frontend" },
        { title: "Frontend" },
        { title: "Frontend" },
        { title: "Frontend" },
        { title: "Frontend" },
        { title: "Frontend" },
        { title: "Frontend" },
        { title: "Frontend" },
        { title: "Frontend" },
        { title: "Frontend" },
      ],
    },
    {
      title: "Priority",
      taskfeature: taskPriority,
      setTaskFeature: setTaskPriority,
      popup: taskPriorityPopup,
      setPopup: setTaskPriorityPopup,
      popupContent: [
        { title: "Low", color: "bg-blue-500" },
        { title: "Medium", color: "bg-yellow-500" },
        { title: "High", color: "bg-red-500" },
      ],
    },
    {
      title: "Tag",
      taskfeature: taskTag,
      setTaskFeature: setTaskTag,
      popup: taskTagPopup,
      setPopup: setTaskTagPopup,
      popupContent: [],
    },
  ];

  useEffect(() => {
    console.log("taskTagArray: ", taskTagArray);
  }, [taskTagArray]);

  function handleAddTask() {
    const taskID = generateCustomCode(10); //generate a random taskID
    const yourtask = {
      title: newTaskTitle,
      taskID,
      description: taskdescription,
      type: taskType,
      date: taskDate,
      priority: taskPriority,
      tag: taskTagArray,
      isCompleted: false,
    };

    AddTask(username, taskID, yourtask)
      .then(() => {
        setOpenPopup(false);
        btnsArray.forEach((item) => {
          item.setPopup(false);
        });
        setAddTaskDescription(false);
      })
      .catch(() => {
        console.log("Something went wrong while storing task");
      });
  }

  return (
    <>
      <div
        className={`${
          OpenPopup ? "flex" : "hidden"
        } absolute justify-center items-start w-screen h-screen top-0 left-0 bg-black/50  backdrop-blur-sm z-20 overflow-x-hidden`}
        onClick={() => {
          setOpenPopup(false);
          btnsArray.forEach((item) => {
            item.setPopup(false);
          });
          setAddTaskDescription(false);
        }}
      >
        <div
          className={` scrollbar1 flex flex-col justify-between gap-2 w-[50%] ${
            addTaskDescription ? "h-[36%]" : "h-[28%]"
          } bg-[#dbdbdb] dark:bg-gray-800 rounded-3xl z-[21] transition-all p-4 animate-PopUpAppear mt-[100px]`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="w-full flex flex-col justify-between gap-3">
            <div className="w-full">
              <div className=" text-sm rounded-xl border-2 w-full outline-thm-clr-1 flex flex-row items-center bg-gray-100 dark:border-gray-500 dark:bg-gray-700">
                <input
                  className="resize-none overflow-auto bg-gray-100 rounded-xl w-full dark:border-gray-500 p-3 dark:bg-gray-700 outline-none dark:placeholder:text-gray-100 placeholder:text-xs"
                  placeholder="Write a new task . . ."
                  value={newTaskTitle}
                  onChange={(e) => {
                    setNewTaskTitle(e.target.value);
                  }}
                />
                <button
                  className="text-2xl bg-thm-clr-1 p-2 px-4 rounded-xl m-2 hover:bg-blue-700 transition-all duration-75"
                  onClick={() => {
                    handleAddTask();
                  }}
                >
                  +
                </button>
              </div>
              <div className="my-3 flex justify-end flex-col">
                {!addTaskDescription ? (
                  <span
                    className="text-sm dark:text-gray-500 flex p-1 w-[28%] rounded-lg duration-100 transition-all items-center cursor-pointer dark:hover:text-gray-300 dark:hover:bg-gray-700"
                    onClick={() => {
                      setAddTaskDescription(true);
                    }}
                  >
                    <LuPlusCircle className="mx-2" />
                    Add Task description
                  </span>
                ) : (
                  <>
                    <div className=" text-sm rounded-xl border-2 w-full outline-thm-clr-1 flex flex-row items-center bg-gray-100 dark:border-gray-500 dark:bg-gray-700">
                      <textarea
                        className="resize-none overflow-auto bg-gray-100 rounded-xl w-full dark:border-gray-500 p-3 dark:bg-gray-700 outline-none dark:placeholder:text-gray-100 placeholder:text-xs"
                        placeholder="Write a description. . ."
                        value={taskdescription}
                        onChange={(e) => {
                          setTaskDescription(e.target.value);
                        }}
                      ></textarea>
                      <div></div>
                    </div>
                    <div className="flex justify-end text-xs">
                      <span
                        className=" flex m-2 gap-2 p-1 px-2 cursor-pointer transition-all duration-75 rounded-lg flex-row justify-center items-center dark:text-gray-500 dark:hover:bg-gray-500 dark:hover:text-gray-300"
                        onClick={() => {
                          setAddTaskDescription(false);
                        }}
                      >
                        <RxCross2 />
                        <span className="">cancel</span>
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="buttons flex flex-row justify-evenly text-sm">
              {btnsArray.map((item, index) => (
                <div key={index} className="w-[20%] ">
                  <button
                    className="p-2 w-full dark:bg-gray-700 rounded-lg"
                    onClick={() => {
                      item.setPopup(!item.popup);
                    }}
                  >
                    <span className="flex gap-1 justify-center items-center">
                      {item.taskfeature === "" ||
                      item.taskfeature === null ||
                      item.title === "Tag" ? (
                        <>
                          <MdKeyboardArrowDown className="text-gray-400" />
                          <span>{item.title}</span>
                        </>
                      ) : (
                        <div className="flex flex-row justify-center items-center gap-2">
                          {item.taskfeature.color && (
                            <span
                              className={`${item.taskfeature.color} w-2 h-2 rounded-full`}
                            ></span>
                          )}
                          <span>{item.taskfeature.title}</span>
                        </div>
                      )}
                    </span>
                  </button>

                  {/* Popup container */}
                  {item.popup && (
                    <div className="max-h-48 ">
                      <div
                        className={`p-2 my-2 dark:bg-gray-700 rounded-lg max-h-60 overflow-auto ${
                          item.title == "Priority"
                            ? "animation-curtain-2 overflow-hidden"
                            : item.title == "Tag"
                            ? "animation-curtain-3 overflow-hidden"
                            : "animation-curtain-1"
                        }`}
                        onClick={(e) => {
                          if (item.title === "Tag") return;
                          item.setPopup(false); //if item.title is not "Tag" then close the popup, otherwise keep it open
                        }}
                      >
                        {item.title === "Tag" && (
                          <div className="flex flex-row justify-center items-center w-full ">
                            {taskTag !== "" && (
                              <span className=" text-xs text-center">#</span>
                            )}
                            <input
                              type="text"
                              className="bg-transparent p-1 w-full placeholder:text-xs text-xs text-center outline-none"
                              placeholder="#tag"
                              value={taskTag}
                              onChange={(e) => {
                                setTaskTag(e.target.value);
                              }}
                            />
                            <button
                              className="p-1 px-2 rounded-lg bg-thm-clr-1 text-center outline-transparent"
                              onClick={() => {
                                taskTagArray.push(taskTag);
                                setTaskTag("");
                              }}
                            >
                              +
                            </button>
                          </div>
                        )}
                        {item.popup && item.popupContent !== 0 && (
                          <>
                            {item.popupContent.map((content, index) => (
                              <button
                                key={index}
                                className="p-2 w-full dark:bg-gray-700 rounded-lg flex flex-row gap-2 justify-center items-center "
                                onClick={() => {
                                  item.setTaskFeature(content);
                                  item.setPopup(false);
                                }}
                              >
                                {content.color && (
                                  <span
                                    className={`${content.color}
                                  w-2 h-2 rounded-full`}
                                  ></span>
                                )}
                                <span className="text-[14px]">
                                  {content.title}
                                </span>
                              </button>
                            ))}
                          </>
                        )}
                        {/* You can place popup content here */}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          className="bg-[#dbdbdb] dark:bg-gray-800 absolute top-0 right-0 p-2 min-h-screen w-[250px]"
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></div>
      </div>
    </>
  );
};

export default AddTaskPopup;
