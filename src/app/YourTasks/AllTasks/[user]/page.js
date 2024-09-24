"use client";
import Task from "@/components/tasks";
import { fetchAllTasks } from "@/Firebase Functions/AddUpdateFetchTask";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const params = useParams();
  const username = params.user;
  // console.log("username", username);

  const [TasksArray, setTasksArray] = useState([]);

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
            {TasksArray.length > 0 ? (
              <>
                <div
                
                  className={`dark:text-gray-400 dark:bg-transparent m-2 p-3 flex flex-row justify-between items-center rounded-lg cursor-pointer bg-gray-100 transition-all duration-75 w-[90%]`}
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
                    <div className="w-24 h-4 flex flex-row px-4 justify-center items-center text-xs border-0 border-r-2">
                      <span>Type</span>
                    </div>
                    <div className="w-24 h-4 flex flex-row px-4 justify-center items-center text-xs border-0 border-r-2">
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

export default page;
