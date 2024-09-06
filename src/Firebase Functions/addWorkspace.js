import { auth, db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "@firebase/firestore";
import React from "react";

const createWorkspace = async ({ workspaceTitle, userIDs }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("creating workspace...");
      await setDoc(doc(db, "workspaces", workspaceTitle), {
        workspaceTitle: workspaceTitle,
        workspaceMembers: [],
        workspaceAdmins: [...userIDs],
        
      });
    } catch (error) {}
  });
};

export default addWorkspace;
