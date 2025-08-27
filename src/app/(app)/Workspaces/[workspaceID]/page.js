"use client";
import AddProjectPopup from "@/components/AddProjectPopup";
import { useUserContext } from "@/context/userContext";
import { db } from "@/lib/firebaseConfig";
import { RiExpandDiagonalFill } from "react-icons/ri";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "@firebase/firestore";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";

import { FaPlus } from "react-icons/fa6";
import { findProjectsDetails } from "@/lib/utils/findProjectsDetails";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const params = useParams();

  const workspaceID = params.workspaceID;

  const [isUserAssigned, setisUserAssigned] = useState(null);
  const [membersData, setMembersData] = useState(null);
  const [detailedMembersData, setDetailedMembersData] = useState([]);
  const [isMembersLoading, setIsMembersLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [projectsArray, setProjectsArray] = useState([]);
  const [isLoadingProjects, setLoadingProjects] = useState([]);
  const [projectsDetailsArray, setProjectsDetailsArray] = useState([]);

  const [AddProjectActivateNum, setAddProjectActivateNum] = useState(0);

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

  useEffect(() => {
    const fetchWorkspace = async () => {
      const docref = doc(db, "workspaces", workspaceID);
      const docSnap = await getDoc(docref);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentWorkspace(data);
        const membersArray = data?.members || [];
        const member = membersArray.find((member) => member.uid == user?.uid);
        if (member) {
          setisUserAssigned(true);
          setIsAdmin(member?.isAdmin);
          setMembersData(membersArray);
          // console.log(data);

          setProjectsArray(data?.projects);
        } else {
          console.log("User is not assigned to workspace");
        }
      } else {
        console.log("No such document!");
      }
      setIsLoadingCurrentWorkspace(false);
    };

    if (isUserLoggedIn && !isLoading && user?.uid) {
      fetchWorkspace();
    } else if (!isUserLoggedIn && !isLoading) {
      router.replace("/sign-up");
    }
  }, [
    user?.uid,
    isLoading,
    isUserLoggedIn,
    workspaceID,
    router,
    setCurrentWorkspace,
    setIsLoadingCurrentWorkspace,
  ]);

  useEffect(() => {
    if (projectsArray.length > 0) {
      findProjectsDetails(projectsArray)
        .then((array) => {
          setProjectsDetailsArray(array);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoadingProjects(false);
        });
    } else {
      setLoadingProjects(false);
    }
  }, [projectsArray]);

  useEffect(() => {
    const fetchDetailedMembersData = async () => {
      if (
        membersData &&
        membersData.length > 0 &&
        detailedMembersData.length === 0
      ) {
        setIsMembersLoading(true);
        try {
          const memberPromises = membersData.map(async (member) => {
            const q = query(
              collection(db, "users"),
              where("uid", "==", member.uid)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              return querySnapshot.docs[0].data();
            }
            return null;
          });

          const resolvedMembers = await Promise.all(memberPromises);
          const validMembers = resolvedMembers.filter(
            (member) => member !== null
          );

          setDetailedMembersData(validMembers);
        } catch (error) {
          console.error("Error fetching members data:", error);
        } finally {
          setIsMembersLoading(false);
        }
      }
    };

    fetchDetailedMembersData();
  }, [membersData, detailedMembersData.length]);

  if (isLoadingCurrentWorkspace) {
    return (
      <div className="mt-7 lg:ml-[270px] lg:mr-[180px] m-10 flex flex-col justify-center items-center">
        <div className="typewriter absolute top-[40vh] self-center">
          <div className="slide">
            <i></i>
          </div>
          <div className="paper"></div>
          <div className="keyboard"></div>
        </div>
      </div>
    );
  }

  if (!isUserAssigned) {
    return <div>You have no permission</div>;
  }
  return (
    <>
      <div className="">
        <div className="fixed w-full top-0  font-bold border-b-2 border-gray-200 dark:border-gray-800 p-2 flex flex-row ">
          <h1 className="text-xl dark:text-gray-300">
            {currentWorkspace?.workspaceTitle === undefined
              ? "not found"
              : currentWorkspace.workspaceTitle}
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
                  membersData.map((member, index) => {
                    return (
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
                            <div className="w-[65px] h-5"></div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>No members found</>
                )}
              </div>
            )}
          </div>
          <div className="listOfUsers lg:w-1/3 dark:bg-gray-800 bg-gray-100 rounded-3xl p-3">
            <div className="text-xl flex flex-row justify-between items-center dark:text-gray-200 font-bold p-1 border-b-2 dark:border-gray-500">
              <h1>Projects</h1>
              <div className="flex justify-center items-center   gap-5">
                <RiExpandDiagonalFill
                  className="hover:bg-gray-700 cursor-pointer text-3xl p-2"
                  onClick={() => {
                    router.push("/projects");
                  }}
                />

                <FaPlus
                  className="hover:bg-gray-700 cursor-pointer "
                  onClick={() => {
                    setAddProjectActivateNum(AddProjectActivateNum + 1);
                  }}
                />
              </div>
            </div>

            <div className="m-4 h-[250px] overflow-auto workspaceScrollBar">
              {isLoadingProjects ? (
                <>loading...</>
              ) : projectsDetailsArray.length > 0 ? (
                projectsDetailsArray.map((project, index) => {
                  console.log(project);

                  return (
                    <Link key={index} href={`/projects/${project.id}`}>
                      <div
                        key={index}
                        className="flex flex-row justify-between items-center border-b-gray-600 border-b-2 p-2 dark:hover:bg-gray-700 hover:cursor-pointer hover:rounded-md transition-all"
                      >
                        <div className="flex gap-2 items-center">
                          <span
                            className={`${project.logo?.bg || "bg-gray-200"} ${
                              project.logo?.textColor
                                ? `text-${project.logo.textColor}`
                                : "text-gray-600"
                            } font-semibold text-center aspect-square flex items-center justify-center text-xs rounded-lg w-6 h-6`}
                          >
                            {project.logo?.letter ||
                              project.workspaceTitle?.[0] ||
                              "W"}
                          </span>
                          <span className="text-sm">{project.title}</span>
                        </div>

                        <div
                          className={`${
                            project.priority == " "
                              ? "bg-green-500 "
                              : project.priority == "medium"
                              ? "bg-yellow-500 "
                              : project.priority == "high"
                              ? "bg-red-600 "
                              : "animate-ping bg-red-500 "
                          } text-black w-2 h-2 rounded-full`}
                          title={`Priority: ${project?.priority}`}
                        ></div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="w-full h-full flex justify-center items-center text-gray-400">
                  No projects found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AddProjectPopup
        activateNum={AddProjectActivateNum}
        username={user.username}
        userid={user.uid}
        ProjectsArray={projectsArray}
        setProjectsArray={setProjectsArray}
        workspaceID={workspaceID}
        workspaceMembers={detailedMembersData}
        workspaceTitle={currentWorkspace?.workspaceTitle}
      />
    </>
  );
};

export default Page;
