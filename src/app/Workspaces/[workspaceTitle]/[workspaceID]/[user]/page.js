"use client";
import { CheckIfUserAssignedToWorkspace } from "@/Firebase Functions/isUserAuthenticated";
import Image from "next/image";
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
          <div className="listOfUsers lg:w-1/3 dark:bg-gray-800 bg-gray-100 rounded-3xl p-3">
            <h1 className="text-xl dark:text-gray-200 font-bold p-1 border-b-2 dark:border-gray-500">
              Members
            </h1>
            {isAdmin && (
              <div className="m-4 max-h-[250px] overflow-auto workspaceScrollBar">
                {membersData !== null ? (
                  <>
                    {membersData.map((member, index) => {
                      console.log(member);
                      return (
                        <>
                          <div
                            key={index}
                            className="w-full dark:border-gray-600 border-gray-200 cursor-pointer hover:bg-gray-300 transition-all dark:hover:bg-gray-600 hover:rounded-lg flex justify-between border-b-2"
                          >
                            <div className=" flex flex-row justify-center items-center">
                              <div className="relative w-10 h-10 m-2 flex justify-center items-center">
                                <Image
                                  src={member.photoURL ? member.photoURL : ""}
                                  fill
                                  alt="dp"
                                  className="rounded-lg bg-blue-100"
                                />
                              </div>
                              <div className="flex flex-col justify-center items-start">
                                <h1 className="dark:text-gray-200 font-bold text-sm">
                                  {member.name}
                                </h1>
                                <h1 className="dark:text-gray-300 text-xs">
                                  {member.username}
                                </h1>
                              </div>
                            </div>
                            <div className="flex flex-row justify-around items-center">
                              {member.isPendingInvitation ? (
                                <h1 className="mx-2 dark:text-orange-400/80 text-xs border-2 p-[3px] rounded-lg dark:border-orange-400/80">
                                  Pending
                                </h1>
                              ) : (
                                <>
                                  <div className="w-16 h-5 "></div>
                                </>
                              )}
                              {member.isAdmin ? (
                                <h1 className="mx-2 dark:text-teal-400/80 text-xs border-2 p-[3px] rounded-lg dark:border-teal-400">
                                  Admin
                                </h1>
                              ) : (
                                <>
                                  {" "}
                                  <div className="w-[65px] h-5"></div>
                                </>
                              )}

                              {/* {member.isPendingInvitation !== null
                                ? member.isPendingInvitation
                                  ? ""
                                  : "Pending"
                                : "null"} */}
                            </div>

                            {/*<h1 className="dark:text-gray-300">
                            isInvitationAccepted:{" "}
                            {member.isInvitationAccepted
                              ? member.isInvitationAccepted
                                ? "true"
                                : "false"
                              : "null"}
                          </h1> */}
                          </div>
                        </>
                      );
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
