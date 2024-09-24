"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchAllTasks } from "@/Firebase Functions/AddUpdateFetchTask";
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
            ? "dark:bg-gray-900 dark:text-gray-400 text-gray-500"
            : "dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 text-black"
        } m-2 p-3 flex flex-row justify-between items-center rounded-lg cursor-pointer bg-gray-100 transition-all duration-1000 w-[90%]`}
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

const Page = () => {
  const params = useParams();
  const username = params.user;
  // console.log("username", username);

  const [TasksArray, setTasksArray] = useState(null);

  useEffect(() => {
    console.log(TasksArray);
  }, [TasksArray]);

  useEffect(() => {
    fetchAllTasks(username)
      .then((tasks) => {
        console.log(tasks);
        setTasksArray(tasks);
      })
      .catch((error) => {
        console.log("error in fetching tasks: ", error);
      });
  }, [username]);

  return (
    <>
      <div className="p-2">
        <div className="flex justify-center items-center flex-col">
          <h1 className="text-2xl font-bold dark:text-gray-200 mt-2">
            All Tasks
          </h1>
          <div className="my-6 w-full flex flex-col items-center">
            {TasksArray === null ? (
              <>
                <div class="typewriter absolute top-[35vh] self-center">
                  <div class="slide">
                    <i></i>
                  </div>
                  <div class="paper"></div>
                  <div class="keyboard"></div>
                </div>
              </>
            ) : TasksArray.length > 0 ? (
              <>
                <div
                  className={`dark:text-gray-400 dark:bg-transparent p-3 flex flex-row justify-between items-center rounded-lg text-gray-400 transition-all duration-75 w-[90%]`}
                >
                  <div className="flex flex-row gap-3 items-center">
                    <div className="">
                      <h1
                        className={`ml-12 text-lg font-bold transition-all duration-1000`}
                      >
                        Task
                      </h1>
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-center">
                    <div className="w-24 h-4 flex flex-row px-4 justify-center items-center text-xs border-0 border-r-2 dark:border-gray-400">
                      <span>Type</span>
                    </div>
                    <div className="w-24 h-4 flex flex-row px-4 justify-center items-center text-xs border-0 border-r-2 dark:border-gray-400">
                      <span className=" text-center">Due date</span>
                    </div>
                    <div className="w-24 h-4 flex flex-row px-4 justify-center items-center text-xs">
                      <span>Priority</span>
                    </div>
                  </div>
                </div>
                {TasksArray.map((task) => {
                  return (
                    <>
                      <Task task={task} username={username} />
                    </>
                  );
                })}
              </>
            ) : (
              <div className="dark:text-gray-500 w-[50vh] h-[90vh] flex justify-center items-center">
                <span className="text-3xl">No tasks found</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
