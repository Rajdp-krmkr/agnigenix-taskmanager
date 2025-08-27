"use client";
import { useUserContext } from "@/context/userContext";
import { fetchProjects } from "@/lib/utils/projectService";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Page = () => {
  const {
    user,
    setUser,
    isUserLoggedIn,
    setIsUserLoggedIn,
    isLoading,
    setIsLoading,
    currentWorkspace,
    setCurrentWorkspace,
    isLoadingCurrentWorkspace,
    setIsLoadingCurrentWorkspace,
  } = useUserContext();

  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    if (user) {
      setIsLoadingProjects(true);

      // Use our new function to fetch projects for this user
      fetchProjects({ userId: user.uid })
        .then((projects) => {
          setAllProjects(projects);
          console.log("Projects loaded:", projects);
        })
        .catch((err) => {
          console.error("Error loading projects:", err);
        })
        .finally(() => {
          setIsLoadingProjects(false);
        });
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isUserLoggedIn) {
    return (
      <div>
        You are not logged in,{" "}
        <Link href="/sign-up" className="text-blue-500 hover:underline">
          sign up
        </Link>
      </div>
    );
  }

  if (isLoadingProjects) {
    //TODO: add typewriter loader
    return <div>Loading projects...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl  font-bold text-gray-900 dark:text-white">
        Projects
      </h2>
      <p className="text-gray-400 text-sm">
        Here is all the projects you are assigned
      </p>
      <div></div>
    </div>
  );
};

export default Page;
