"use client";
import { useTheme } from "@/context/ThemeContext";

/**
 * Hook for theme-aware class names
 * @param {string} lightClasses - Classes for light mode
 * @param {string} darkClasses - Classes for dark mode
 * @returns {string} - Appropriate classes for current theme
 */
export const useThemeClasses = (lightClasses = "", darkClasses = "") => {
  const { theme, mounted } = useTheme();

  if (!mounted) {
    // Return neutral classes during SSR/hydration
    return lightClasses;
  }

  return theme === "dark" ? darkClasses : lightClasses;
};

/**
 * Hook for conditional theme-based values
 * @param {any} lightValue - Value for light mode
 * @param {any} darkValue - Value for dark mode
 * @returns {any} - Appropriate value for current theme
 */
export const useThemeValue = (lightValue, darkValue) => {
  const { theme, mounted } = useTheme();

  if (!mounted) {
    return lightValue;
  }

  return theme === "dark" ? darkValue : lightValue;
};

/**
 * Theme-aware dynamic classes utility
 * @param {Object} classMap - Object with light and dark class mappings
 * @returns {string} - Concatenated classes for current theme
 */
export const useThemeDynamicClasses = (classMap) => {
  const { theme, mounted } = useTheme();

  if (!mounted || !classMap) {
    return classMap?.light || "";
  }

  const baseClasses = classMap.base || "";
  const themeClasses =
    theme === "dark" ? classMap.dark || "" : classMap.light || "";

  return `${baseClasses} ${themeClasses}`.trim();
};
