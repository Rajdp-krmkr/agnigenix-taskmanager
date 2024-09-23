import React, { useEffect, useState } from "react";
import { FaRegCircle, FaRegCheckCircle } from "react-icons/fa";
import { setTaskCompleted } from "@/Firebase Functions/AddUpdateFetchTask";

const Task = ({ username, task }) => {
  const taskID = task.taskID;
  const taskTitle = task.title;
  const taskDescription = task.description;

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
        className="m-2 p-3 flex flex-row gap-3 items-center rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-75 w-[90%]"
      >
        <div
          className={`${
            istaskCompleted ? "line-through dark:text-gray-400" : ""
          } completedIcon `}
          onClick={() => {
            setIsTaskCompleted(true);
            setTaskCompleted(username, taskID)
              .then(() => {
                console.log(`task ${taskID} completed`);
              })
              .catch(() => {
                console.log(`task ${taskID} not completed`);
                setIsTaskCompleted(false);
              });
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
              istaskCompleted
                ? "line-through dark:text-gray-400 decoration-[3px]"
                : "dark:text-gray-200"
            } text-lg font-bold transition-all duration-1000`}
          >
            {taskTitle}
          </h1>
          <p
            className={` ${
              istaskCompleted
                ? "line-through dark:text-gray-400 decoration-[3px]"
                : ""
            } text-sm dark:text-gray-200 transition-all duration-1000`}
          >
            {taskDescription}
          </p>
        </div>
      </div>
    </>
  );
};

export default Task;
