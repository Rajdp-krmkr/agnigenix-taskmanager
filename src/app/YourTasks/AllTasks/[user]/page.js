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
          <div className="my-6 w-full flex flex-col justify-center">
            {TasksArray.length > 0 ? (
              TasksArray.map((task) => {
                return (
                  <>
                    <Task task={task} username={username} />
                  </>
                );
              })
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
