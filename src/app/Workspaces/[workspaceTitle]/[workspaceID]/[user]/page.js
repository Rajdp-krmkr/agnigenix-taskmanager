"use client";
import { CheckIfUserAssignedToWorkspace } from "@/Firebase Functions/isUserAuthenticated";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const workspaceTitle = params.workspaceTitle;
  const workspaceID = params.workspaceID;
  const username = params.user;

  console.log(workspaceTitle, workspaceID, username);
  const [isUserAssigned, setisUserAssigned] = useState(null);
  const [isWorkspaceFound, setIsWorkspaceFound] = useState(null);
  const [UserAssignmentMessage, setUserAssignmentMessage] = useState(null);

  useEffect(() => {
    if (workspaceTitle && workspaceID && username) {
      CheckIfUserAssignedToWorkspace(workspaceTitle, workspaceID, username)
        .then((res) => {
          setIsWorkspaceFound(res.isWorkspaceFound);
          setisUserAssigned(res.isAssigned);
          setUserAssignmentMessage(res.message);
        })
        .catch((err) => {
          setIsWorkspaceFound(err.isWorkspaceFound);
          setisUserAssigned(err.isAssigned);
          setUserAssignmentMessage(err.message);
        });
    }
  }, [workspaceID, username]);

  useEffect(() => {
    if (isUserAssigned === false) {
      // console.log("User is not assigned to workspace");
      router.push("/sign-up");
    }
  }, [isUserAssigned]);

  return (
    <div className="ml-[500px]">
      <h1>Workspace Title: {workspaceTitle}</h1>
      <h1>Workspace ID: {workspaceID}</h1>
      <h1>Username: {username}</h1>
      <h1>isUserAssigned: {isUserAssigned === null? "null" : isUserAssigned ? "true" : "false"}</h1>
      <h1>isWorkspaceFound: {isWorkspaceFound === null? "null" : isWorkspaceFound ? "true" : "false"}</h1>
      <h1>UserAssignmentMessage: {UserAssignmentMessage}</h1>
    </div>
  );
};

export default Page;
