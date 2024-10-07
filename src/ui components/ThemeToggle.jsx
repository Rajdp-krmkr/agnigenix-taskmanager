"use client";
import React, { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(null);
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme == "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  return (
    <>
      {/* <div
        className="relative w-16 h-8 flex items-center dark:bg-gray-900 bg-thm-clr-1 cursor-pointer rounded-full p-1 transition-all"
        onClick={() => setDarkMode(!darkMode)}
      >
        <FaMoon className="text-white" size={18} />
        <div
          className=" absolute bg-white w-6 h-6  rounded-full shadow-md transform transition-transform duration-300"
          style={darkMode ? { left: "4px" } : { right: "4px" }}
        ></div>
        <BsSunFill className=" ml-auto mr-1 text-yellow-400" size={18} />
      </div> */}
      <div
        className="flex justify-center items-center cursor-pointer"
        onClick={() => setDarkMode(!darkMode)}
      >
        {!darkMode ? (
          <FaMoon className="text-gray-400" size={18} />
        ) : (
          <BsSunFill className=" ml-auto mr-1 text-yellow-400" size={18} />
        )}
      </div>
    </>
  );
};

export default ThemeToggle;
