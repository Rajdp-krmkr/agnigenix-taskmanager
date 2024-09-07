'use client'
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const params = useParams();
  const workspaceTitle = params.workspaceTitle;
  const workspaceID = params.workspaceID;
  const username = params.user;
  return (
    <div className="ml-[500px]">
      <h1>Workspace Title: {workspaceTitle}</h1>
      <h1>Workspace ID: {workspaceID}</h1>
      <h1>Username: {username}</h1>
    </div>
  );
};

export default Page;
