"use client";
import ThemeToggle from "@/components/ThemeToggle";
import { useUserContext } from "@/context/userContext";
import { GetUserDataByUsername } from "@/Firebase Functions/GetuserData";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const username = params.user;
  // console.log("username", username);
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
    return;
  }

  return (
    <>
      <div className="mt-7 lg:ml-[240px] lg:mr-[180px] m-10 flex justify-center items-center">
        <div className="m-2 w-full">
          <h1
            className="text-2xl font-bold mx-12 cursor-pointer"
            onClick={() => {
              router.push(`/Dashboard`);
            }}
          >
            Dashboard
          </h1>
          <div className="h-full">
            <span>Page is under construction</span>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </>
  );
};

export default Page;
