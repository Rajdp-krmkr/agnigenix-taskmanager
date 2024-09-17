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
  const [membersData, setMembersData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (workspaceTitle && workspaceID && username) {
      CheckIfUserAssignedToWorkspace(workspaceTitle, workspaceID, username)
        .then((res) => {
          setIsWorkspaceFound(res.isWorkspaceFound);
          setisUserAssigned(res.isAssigned);
          setUserAssignmentMessage(res.message);
          setMembersData(res.membersData);
        })
        .catch((err) => {
          setIsWorkspaceFound(err.isWorkspaceFound);
          setisUserAssigned(err.isAssigned);
          setUserAssignmentMessage(err.message);
          setMembersData(res.membersData);
        });
    }
  }, [workspaceID, username]);

  useEffect(() => {
    if (isUserAssigned === false) {
      // console.log("User is not assigned to workspace");
      router.push("/sign-up");
    }
  }, [isUserAssigned]);

  useEffect(() => {
    if (membersData !== null) {
      for (let i = 0; i < membersData.length; i++) {
        if (
          membersData[i].username === username &&
          membersData[i].isAdmin == true
        ) {
          setIsAdmin(true);
          break;
        }
      }
    }
  }, [membersData]);

  return (
    // <div className="ml-[230px]">
    //   <h1>WorkspaceTitle: { !isWorkspaceFound || isWorkspaceFound === null ? "not found" : workspaceTitle}</h1>
    //   <h1>WorkspaceID: {workspaceID}</h1>
    //   <h1>Username: {username}</h1>
    //   <h1>
    //     isWorkspaceFound:{" "}
    //     {isWorkspaceFound === null
    //       ? "null"
    //       : isWorkspaceFound
    //       ? "true"
    //       : "false"}
    //   </h1>
    //   <h1>
    //     isUserAssigned:{" "}
    //     {isUserAssigned === null ? "null" : isUserAssigned ? "true" : "false"}
    //   </h1>
    //   <h1>UserAssignmentMessage: {UserAssignmentMessage}</h1>
    //   {isAdmin && (
    //     <div className=" m-4">
    //       {membersData !== null ? (
    //         <>
    //           {membersData.map((member, index) => {
    //             return [
    //               <div key={index}>
    //                 <h1>Username: {member.username}</h1>
    //                 <h1>
    //                   isPendingInvitation:{" "}
    //                   {member.isPendingInvitation !== null
    //                     ? member.isPendingInvitation
    //                       ? "true"
    //                       : "false"
    //                     : "null"}
    //                 </h1>
    //                 <h1>
    //                   isInvitationAccepted:{" "}
    //                   {member.isInvitationAccepted !== null
    //                     ? member.isInvitationAccepted
    //                       ? "true"
    //                       : "false"
    //                     : "null"}
    //                 </h1>
    //               </div>,
    //             ];
    //           })}
    //         </>
    //       ) : (
    //         <>No members found</>
    //       )}
    //     </div>
    //   )}
    // </div>
    <>
      <div className="ml-[250px]">
        <div className="fixed  w-full top-0  font-bold border-b-2 border-gray-200 dark:border-gray-800 p-2 flex flex-row ">
          <h1 className="text-xl dark:text-gray-300">
            {!isWorkspaceFound || isWorkspaceFound === null
              ? "not found"
              : workspaceTitle}
          </h1>
        </div>
        <div className="mt-12 p-2">
          <div className="listOfUsers lg:w-1/3 dark:bg-gray-700 rounded-3xl p-3">
            <h1 className="text-xl dark:text-gray-200 font-bold p-1 border-b-2 dark:border-gray-500">Members</h1>
            {isAdmin && (
              <div className="m-4">
                {membersData !== null ? (
                  <>
                    {membersData.map((member, index) => {
                      return [
                        <div key={index}>
                          <h1 className="dark:text-gray-300">
                            Username: {member.username}
                          </h1>
                          <h1 className="dark:text-gray-300">
                            isPendingInvitation:{" "}
                            {member.isPendingInvitation !== null
                              ? member.isPendingInvitation
                                ? "true"
                                : "false"
                              : "null"}
                          </h1>
                          <h1 className="dark:text-gray-300">
                            isInvitationAccepted:{" "}
                            {member.isInvitationAccepted !== null
                              ? member.isInvitationAccepted
                                ? "true"
                                : "false"
                              : "null"}
                          </h1>
                        </div>,
                      ];
                    })}
                  </>
                ) : (
                  <>No members found</>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
