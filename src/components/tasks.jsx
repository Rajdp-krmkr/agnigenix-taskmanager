import React, { useEffect, useState } from "react";
import { FaRegCircle, FaRegCheckCircle } from "react-icons/fa";
import { setTaskCompleted } from "@/Firebase Functions/AddUpdateFetchTask";

const Task = ({ username, task }) => {
  const taskID = task.taskID;
  const taskTitle = task.title;
  const taskDescription = task.description;
  const taskPriority = task.priority;
  const taskTag = task.tag;
  const taskType = task.type;
  const taskDueDate = task.date;

  console.log("taskPriority", taskPriority);

  console.log(taskID, taskTitle, taskDescription);
  const [istaskCompleted, setIsTaskCompleted] = useState(false);

  useEffect(() => {
    if (task.isCompleted) {
      setIsTaskCompleted(true);
    }
  }, [task]);

  return (
    <>
      <div
        key={taskID}
        className={`${
          istaskCompleted
            ? "dark:bg-gray-900 dark:text-gray-400"
            : "dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 "
        } m-2 p-3 flex flex-row justify-between items-center rounded-lg cursor-pointer bg-gray-100 transition-all duration-75 w-[90%]`}
      >
        <div className="flex flex-row gap-3 items-center">
          <div
            className={`${
              istaskCompleted ? "line-through dark:text-gray-400" : ""
            } completedIcon `}
            onClick={() => {
              if (!istaskCompleted) {
                setIsTaskCompleted(true);
                setTaskCompleted(username, taskID)
                  .then(() => {
                    console.log(`task ${taskID} completed`);
                  })
                  .catch(() => {
                    console.log(`task ${taskID} not completed`);
                    setIsTaskCompleted(false);
                  });
              }
            }}
          >
            {istaskCompleted ? (
              <FaRegCheckCircle className="mx-2 text-xl" />
            ) : (
              <FaRegCircle className="mx-2 text-xl" />
            )}
          </div>
          <div className="">
            <h1
              className={`${
                istaskCompleted ? "line-through decoration-[3px]" : ""
              } text-lg font-bold transition-all duration-1000`}
            >
              {taskTitle}
            </h1>
            <p
              className={` ${
                istaskCompleted ? "line-through decoration-[3px]" : ""
              } text-sm transition-all duration-1000`}
            >
              {taskDescription}
            </p>
          </div>
        </div>

        <div className="flex flex-row items-center justify-around">
          <div className="w-24 h-4 flex flex-row gap-2 justify-center items-center text-xs   ">
            <span>{taskType !== null && taskType.title}</span>
          </div>
          <div className="w-24 h-4 flex flex-row gap-2 justify-center items-center text-xs  ">
            <span>{taskDueDate !== null && taskDueDate}</span>
          </div>
          <div className="w-24 h-4 flex flex-row gap-2 justify-center items-center text-xs  ">
            {!istaskCompleted && (
              <div
                className={`${
                  taskPriority !== null && taskPriority.color
                } w-2 h-2 rounded-full`}
              ></div>
            )}
            <span>{taskPriority !== null && taskPriority.title}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;
