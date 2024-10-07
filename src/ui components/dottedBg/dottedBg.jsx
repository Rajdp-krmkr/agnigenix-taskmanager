"use client";
import React, { useEffect, useRef } from "react";
import styles from "./LandingPage.module.css";

const DottedBg = () => {
  const landingPageRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (landingPageRef.current) {
        // Get the width and height of the window
        const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

        // Calculate the position as a fraction of the window size
        const xPos = (e.clientX / windowWidth) * 100;
        const yPos = (e.clientY / windowHeight) * 100;

        // Set the background position with some movement offset
        // Note: background-position is adjusted by converting percentage to pixels
        landingPageRef.current.style.backgroundPosition = `${xPos * 0.1}px ${
          yPos * 0.1
        }px`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <div
      ref={landingPageRef}
      className={`${styles.landingpage} dark:invert`}
    ></div>
  );
};

export default DottedBg;
