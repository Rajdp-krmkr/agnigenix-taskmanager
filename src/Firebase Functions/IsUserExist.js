import { db } from "@/lib/firebaseConfig";
import { doc, getDoc } from "@firebase/firestore";
import React from "react";

const IsUserExist = (user) => {
  const { uid } = user;
  return new Promise(async (resolve, reject) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      resolve(docSnap.data());
    } else {
      reject(false);
    }
  });
};

export default IsUserExist;
