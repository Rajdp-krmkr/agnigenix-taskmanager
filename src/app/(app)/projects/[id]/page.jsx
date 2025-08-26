"use client";
import { useUserContext } from "@/context/userContext";
import fetchCurrentProject from "@/lib/utils/fetchCurrentProject";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const Project = () => {
  const params = useParams();
  const id = params.id;

  const {
    isCurrentProjectLoading,
    setIsCurrentProjectLoading,
    currentProject,
    setCurrentProject,
  } = useUserContext();

  useEffect(() => {
    let isMounted = true;

    const fetchProject = async () => {
      setIsCurrentProjectLoading(true);
      const project = await fetchCurrentProject(id);
      if (isMounted) {
        setCurrentProject(project);
        setIsCurrentProjectLoading(false);
      }
    };

    fetchProject();

    return () => {
      isMounted = false;
      setIsCurrentProjectLoading(false);
    };
  }, [id]);

  if (isCurrentProjectLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="typewriter">
          <div className="slide">
            <i></i>
          </div>
          <div className="paper"></div>
          <div className="keyboard"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {currentProject && <h1>projecttitile: {currentProject.title}</h1>}
    </div>
  );
};

export default Project;
