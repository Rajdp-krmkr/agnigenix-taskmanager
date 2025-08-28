"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WorkspaceContext = createContext();

export const WorkspaceContextProvider = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [isLoadingCurrentWorkspace, setIsLoadingCurrentWorkspace] =
    useState(true);

  const value = useMemo(
    () => ({
      currentWorkspace,
      setCurrentWorkspace,
      isLoadingCurrentWorkspace,
      setIsLoadingCurrentWorkspace,
    }),
    [currentWorkspace, isLoadingCurrentWorkspace]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceContext = () => useContext(WorkspaceContext);
