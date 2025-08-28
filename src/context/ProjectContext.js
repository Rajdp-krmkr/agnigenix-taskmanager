"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ProjectContext = createContext();
export const ProjectContextProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [isCurrentProjectLoading, setIsCurrentProjectLoading] = useState(true);

  const value = useMemo(
    () => ({
      currentProject,
      setCurrentProject,
      isCurrentProjectLoading,
      setIsCurrentProjectLoading,
    }),
    [currentProject, isCurrentProjectLoading]
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
export const useProjectContext = () => useContext(ProjectContext);
