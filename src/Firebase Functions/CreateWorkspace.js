import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "@firebase/firestore";

const CreateWorkspace = (
  workspaceID,
  {
    workspaceTitle,
    workspaceDescription,
    isPrivate,
    LogoLetter,
    customizedLogo,
    members,
    url,
  }
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, "workspaces", workspaceID);
      await setDoc(docRef, {
        workspaceTitle: workspaceTitle,
        workspaceDescription: workspaceDescription,
        isPrivate: isPrivate,
        LogoLetter: LogoLetter,
        customizedLogo: customizedLogo,
        members: [...members],
        url: url,
      });
      console.log("Document written with ID: ", docRef.id);
      console.log(workspaceID);
      resolve(workspaceID);
    } catch (error) {
      reject(error);
    }
  });
};

export default CreateWorkspace;

export const updateWorkspaceinUsers = (username, [...WorkspaceArray]) => {
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, "users", username);
      await updateDoc(docRef, {
        workspaces: WorkspaceArray,
      });
      console.log("Document written with ID: ", docRef.id);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const updateWorkspace = (workspaceID, username, type) => {
  return new Promise(async (resolve, reject) => {
    const docRef = doc(db, "workspaces", workspaceID);
    const docSnap = await getDoc(docRef);
    const members = docSnap.data().members;

    try {
      console.log(members, docSnap.data());

      for (let i = 0; i < members.length; i++) {
        if (members[i].username === username) {
          members[i].isPendingInvitation = false;
          if (type === "Invitation rejected") {
            members[i].isInvitationAccepted = false;
          }
          if (type === "Invitation accepted") {
            members[i].isInvitationAccepted = true;
          }
          if (type === "Invitation expired") {
            members[i].isInvitationAccepted = null;
          }
          console.log(members[i]);
          break;
        }
      } //? updated the members array
      console.log(members);

      await updateDoc(docRef, {
        members: members,
      })
        .then(() => {
          console.log(
            `succesfully added ${username} to workspace ${workspaceID}`
          );
        })
        .catch((error) => {
          console.error(error);
        });

      resolve();
    } catch (error) {
      reject("error: ", error);
    }
  });
};
