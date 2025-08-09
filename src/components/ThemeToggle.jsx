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
  );
};

export default ThemeToggle;
