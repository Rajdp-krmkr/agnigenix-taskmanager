"use client";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="fixed w-screen">
      <div className=" flex flex-row justify-center m-3 items-center ">
        <ul className="flex flex-row items-center justify-between w-[70%]">
          <li className="">
            <h1 className="text-2xl font-bold">Task Manager</h1>
          </li>
          <li className="">
            <div className="flex justify-evenly gap-7">
              <button
                className="p-1 px-5 rounded-md hover:bg-transparent font-semibold border-2 border-thm-clr-1 transition-all hover:text-black text-white bg-thm-clr-1"
                onClick={() => {
                  router.push("/sign-up");
                }}
              >
                <span>Sign up</span>
              </button>

              <button
                className="p-1 px-5 rounded-md hover:bg-transparent font-semibold border-2 border-thm-clr-2 transition-all hover:text-black text-black bg-thm-clr-2"
                onClick={() => {
                  router.push("/sign-in");
                }}
              >
                <span>Sign in</span>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
