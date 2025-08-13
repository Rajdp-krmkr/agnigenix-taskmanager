"use client";
import React from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div
        className={`flex justify-center items-center cursor-pointer w-[18px] h-[18px] ${className}`}
      >
        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <button
      className={`flex justify-center items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md p-1 transition-all duration-200 ${className}`}
      onClick={toggleTheme}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="theme-toggle-icon">
        {theme === "light" ? (
          <FaMoon className="text-gray-600 dark:text-gray-400" size={16} />
        ) : (
          <BsSunFill
            className="text-yellow-500 dark:text-yellow-400"
            size={16}
          />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
