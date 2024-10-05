"use client";
import AddProjectPopup from "@/components/AddProjectPopup";
import { CheckIfUserAssignedToWorkspace } from "@/Firebase Functions/isUserAuthenticated";
import getProjects from "@/Firebase Functions/projects";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { FaPlus } from "react-icons/fa6";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const workspaceTitle = params.workspaceTitle;
  const workspaceID = params.workspaceID;
  const username = params.user;

  // console.log(workspaceTitle, workspaceID, username);

  const [isUserAssigned, setisUserAssigned] = useState(null);
  const [isWorkspaceFound, setIsWorkspaceFound] = useState(null);
  const [UserAssignmentMessage, setUserAssignmentMessage] = useState(null);
  const [membersData, setMembersData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [AddProjectActivateNum, setAddProjectActivateNum] = useState(0);

  const [ProjectsArray, setProjectsArray] = useState(null);

  useEffect(() => {
    if (workspaceTitle && workspaceID && username) {
      CheckIfUserAssignedToWorkspace(workspaceTitle, workspaceID, username)
        .then((res) => {
          setIsWorkspaceFound(res.isWorkspaceFound);
          setisUserAssigned(res.isAssigned);  
          setUserAssignmentMessage(res.message);
          setMembersData(res.membersData);
          // setProjectsArray(res.projects);

          getProjects(workspaceID)
            .then((projects) => {
              setProjectsArray(projects);
              console.log("projects: ", projects);
            })
            .catch((err) => {
              console.error("error in getting Projects: ", err);
            });
        })
        .catch((err) => {
          setIsWorkspaceFound(err.isWorkspaceFound);
          setisUserAssigned(err.isAssigned);
          setUserAssignmentMessage(err.message);
          setMembersData(err.membersData);
          // setProjectsArray(res.projects);
          setProjectsArray(null); //! important
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
        <div className="mt-12 p-2 flex flex-row gap-5">
          <div className="listOfUsers lg:w-1/3 dark:bg-gray-800 bg-gray-100 rounded-3xl p-3">
            <div className="text-xl flex flex-row justify-between items-center dark:text-gray-200 font-bold p-1 border-b-2 dark:border-gray-500">
              <h1>Members</h1>
              <FaPlus className="hover:bg-gray-700 rounded-sm cursor-pointer" />
            </div>
            {isAdmin && (
              <div className="m-4 h-[250px] overflow-auto workspaceScrollBar">
                {membersData !== null ? (
                  <>
                    {membersData.map((member, index) => {
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

                            {/* <h1 className="dark:text-gray-300">
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
          <div className="listOfUsers lg:w-1/3 dark:bg-gray-800 bg-gray-100 rounded-3xl p-3">
            <div className="text-xl flex flex-row justify-between items-center dark:text-gray-200 font-bold p-1 border-b-2 dark:border-gray-500">
              <h1>Projects</h1>
              <FaPlus
                className="hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  setAddProjectActivateNum(AddProjectActivateNum + 1);
                }}
              />
            </div>

            <div className="m-4 h-[250px] overflow-auto workspaceScrollBar">
              {ProjectsArray !== null ? (
                <>
                  {ProjectsArray.length > 0 ? (
                    <>
                      {ProjectsArray.map((project, index) => (
                        <>
                          <div
                            key={index}
                            className="flex flex-row justify-between items-center border-b-gray-600 border-b-2 p-2 dark:hover:bg-gray-700 hover:cursor-pointer hover:rounded-md transition-all"
                          >
                            <div className="flex flex-col">
                              <h1 className="dark:text-gray-200 font-bold text-sm">
                                {project.projectTitle}
                              </h1>
                              <h2 className="dark:text-gray-300 text-xs">
                                {project.projectDescription}
                              </h2>
                            </div>
                            <div className="">
                              {project.isPrivate && (
                                <div className=" flex fill-black dark:fill-slate-300 justify-center items-center">
                                  <svg
                                    className="lock-svgIcon w-4 h-4"
                                    viewBox="-0.5 -0.5 16 16"
                                  >
                                    <path
                                      d="M7.5 8.235c-0.1949375 0 -0.38187499999999996 0.0775 -0.5196875 0.2153125s-0.2153125 0.32475 -0.2153125 0.5196875v2.205c0 0.1949375 0.0775 0.38187499999999996 0.2153125 0.51975s0.32475 0.21525 0.5196875 0.21525c0.1949375 0 0.3819375 -0.07743749999999999 0.51975 -0.21525s0.21525 -0.32481250000000006 0.21525 -0.51975v-2.205c0 -0.1949375 -0.07743749999999999 -0.38187499999999996 -0.21525 -0.5196875s-0.32481250000000006 -0.2153125 -0.51975 -0.2153125Zm3.675 -2.94V3.825c0 -0.9746875 -0.3871875 -1.9094375 -1.076375 -2.598625S8.4746875 0.15 7.5 0.15c-0.9746875 0 -1.9094375 0.3871875 -2.598625 1.076375S3.825 2.8503125000000002 3.825 3.825v1.47c-0.5848125 0 -1.145625 0.23231249999999998 -1.5591875 0.6458125000000001C1.8523124999999998 6.354375 1.62 6.9152499999999995 1.62 7.5v5.145c0 0.58475 0.23231249999999998 1.145625 0.6458125000000001 1.5591875 0.41356249999999994 0.4135 0.974375 0.6458125000000001 1.5591875 0.6458125000000001h7.35c0.58475 0 1.145625 -0.23231249999999998 1.5591875 -0.6458125000000001 0.4135 -0.41356249999999994 0.6458125000000001 -0.9744375 0.6458125000000001 -1.5591875V7.5c0 -0.58475 -0.23231249999999998 -1.145625 -0.6458125000000001 -1.5591875 -0.41356249999999994 -0.4135 -0.9744375 -0.6458125000000001 -1.5591875 -0.6458125000000001ZM5.295 3.825c0 -0.5848125 0.23231249999999998 -1.145625 0.6458125000000001 -1.5591875C6.354375 1.8523124999999998 6.9152499999999995 1.62 7.5 1.62s1.145625 0.23231249999999998 1.5591875 0.6458125000000001c0.4135 0.41356249999999994 0.6458125000000001 0.974375 0.6458125000000001 1.5591875v1.47H5.295V3.825Zm6.615 8.82c0 0.1949375 -0.07743749999999999 0.3819375 -0.21525 0.51975s-0.32481250000000006 0.21525 -0.51975 0.21525H3.825c-0.1949375 0 -0.38187499999999996 -0.07743749999999999 -0.51975 -0.21525 -0.1378125 -0.1378125 -0.21525 -0.32481250000000006 -0.21525 -0.51975V7.5c0 -0.1949375 0.07743749999999999 -0.38187499999999996 0.21525 -0.5196875 0.137875 -0.1378125 0.32481250000000006 -0.2153125 0.51975 -0.2153125h7.35c0.1949375 0 0.3819375 0.0775 0.51975 0.2153125s0.21525 0.32475 0.21525 0.5196875v5.145Z"
                                      fill="" 
                                      stroke-width="1"
                                    ></path>
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="w-full h-full flex justify-center items-center text-gray-400">
                        No workspace found
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div className="h-full w-full flex justify-center items-center">
                    <div class="loader w-9 h-9 border-[4px] border-white"></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <AddProjectPopup
        activateNum={AddProjectActivateNum}
        username={username}
        ProjectsArray={ProjectsArray}
        workspaceID={workspaceID}
        workspaceMembers={membersData}
        workspaceTitle={workspaceTitle}
      />
    </>
  );
};

export default Page;
