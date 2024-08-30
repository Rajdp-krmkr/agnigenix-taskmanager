"use client";
import styles from "./LandingPage.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Home() {
  const router = useRouter();

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
    <>
      <div ref={landingPageRef} className={styles.landingpage}></div>
      <div className=" w-screen h-screen flex justify-center items-center bg-transparent">
        <div className="flex flex-col justify-center items-center w-[50%] text-center gap-10">
          <h1 className="font-bold text-5xl m-5 my-0">
            Empower Your Productivity with Agnigenix Task Manager
          </h1>
          <p className="m-4 text-gray-500">
            Welcome to the Agnigenix Task Manager—your go-to tool for
            streamlined productivity. Simplify your workflow, prioritize tasks,
            and collaborate effortlessly. Achieve more with less effort and stay
            on top of your goals with Agnigenix
          </p>
          <div className="btn flex justify-between w-[40%]">
            <button
              className="text-lg p-2 px-6 rounded-md hover:bg-white font-semibold border-2 border-thm-clr-1 transition-all hover:text-black text-white bg-thm-clr-1"
              onClick={() => {
                router.push("/sign-up");
              }}
            >
              <span>Sign up</span>
            </button>

            <button
              className="text-lg p-2 px-6 rounded-md hover:bg-white font-semibold border-2 border-thm-clr-2 transition-all hover:text-black text-black bg-thm-clr-2"
              onClick={() => {
                router.push("/log-in");
              }}
            >
              <span>Sign in</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
