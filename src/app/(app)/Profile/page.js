"use client";
import { useUserContext } from "@/context/userContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();

  const {
    user,
    setUser,
    isUserLoggedIn,
    setIsUserLoggedIn,
    isLoading,
    setIsLoading,
  } = useUserContext();

  if (isLoading) {
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

  if (!isLoading && !isUserLoggedIn) {
    router.replace("/sign-up");
  }

  return (
    <div className="mt-7 lg:ml-[270px] lg:mr-[180px] m-10 flex flex-col justify-center items-center">
      <div className="m-2 w-full">
        <h1 className="text-2xl font-bold mx-12">Profile</h1>
        <p className="mx-12 text-gray-400 text-xs">
          This is your profile page, you can view and edit your information here
        </p>
      </div>
      <div className="w-[90%] min-h-[70vh] flex flex-row gap-7 mx-20 m-5">
        <div className="flex w-[50%] h-max rounded-3xl flex-col gap-2 bg-gray-100 dark:bg-gray-800">
          <div className="photos h-[190px] ">
            <div className="coverPhoto relative w-full h-36 bg-black rounded-t-3xl">
              {user?.coverPhoto ? (
                <Image
                  src={user?.coverPhoto}
                  fill
                  className="rounded-t-3xl bg-cover"
                  alt="cover-photo"
                />
              ) : null}
            </div>
            <div className="absolute w-24 h-24 top-[210px] ml-7">
              <Image
                src={user?.photoURL}
                width={70}
                height={70}
                className="rounded-3xl border-2 border-white"
                alt="profile-photo"
              />
            </div>
          </div>
          <div className="name&Username ml-7 mb-5">
            <h2 className="font-bold">{user?.name}</h2>
            <span className="text-xs text-gray-500">{user?.username}</span>
          </div>
          <div className="bio mx-6 my-5 min-h-[20%]">
            <span className="font-bold py-2">Bio</span>
            <p className={` min-h-[10%] rounded-lg p-2 text-gray-400 text-xs`}>
              {user?.bio == "" ? "Click on edit and write a bio" : user?.bio}
            </p>
            {/* <div className="w-full h-[2px] bg-gray-300 my-4"></div> */}
          </div>
        </div>
        <div className="flex w-[50%] h-[50%] flex-col gap-5">
          <div className="flex rounded-3xl flex-col gap-2 bg-gray-100 dark:bg-gray-800 p-4">
            <h1 className="font-bold">Personal information</h1>
            <div>
              <div className="w-full">
                <h3 className="text-xs font-semibold">Email address</h3>
                <p className="text-xs text-gray-400">
                  {user?.email == "" || user?.email == null
                    ? "No email found, please enter an email"
                    : user?.email}
                </p>
              </div>
              <div className="w-full my-3">
                <h3 className="text-xs font-semibold">Job role</h3>
                <p className="text-xs text-gray-400">
                  {user?.jobRole == "" || user?.jobRole == null
                    ? "No job role added, Enter a job role"
                    : user?.jobRole}
                </p>
              </div>
            </div>
          </div>
          <div className="flex rounded-3xl flex-col gap-2 bg-gray-100 dark:bg-gray-800 p-4">
            <h1 className="font-bold">Social Media accounts</h1>
            <div>
              {user?.socialMediaAcounts.length == 0 ? (
                <>
                  <p className="text-xs text-gray-400">
                    No social media accounts found
                  </p>
                  <p className="text-xs text-gray-400">
                    Click on edit to add social media accounts
                  </p>
                </>
              ) : (
                user?.socialMediaAcounts.map((account) => {
                  <div className="text-xs text-gray-400 p-2 rounded-lg bg-white border-2 my-2 w-full">
                    <span>{account}</span>
                  </div>;
                })
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Page;
