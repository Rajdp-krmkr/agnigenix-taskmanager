import {
  updateWorkspace,
  updateWorkspaceinUsers,
} from "@/Firebase Functions/CreateWorkspace";
import { updateNotifications } from "@/Firebase Functions/GetAndPostNotifications";
import GetUserData, {
  GetUserDataByUsername,
} from "@/Firebase Functions/GetuserData";
import { Work_Sans } from "next/font/google";

const acceptInvitation = (username, notification) => {
  return new Promise(async (resolve, reject) => {
    GetUserDataByUsername({ username }).then((data) => {
      const { workspaces } = data;

      const updatedWorkspaceArray = workspaces;

      notification.workSpace.url = `/Workspaces/${notification.workSpace.workspaceTitle}/${notification.workSpace.workspaceID}/${username}`;

      notification.isInvitationAccepted = true;
      notification.isInvitationExpired = true;
      notification.Body = "";

      for (let i = 0; i < notification.workSpace.members.length; i++) {
        if (notification.workSpace.members[i].username === username) {
          notification.workSpace.members[i].isPendingInvitation = false;
          notification.workSpace.members[i].isInvitationAccepted = true;
          break;
        }
      }
      // console.log(workSpace);

      updatedWorkspaceArray.push(notification.workSpace);

      updateWorkspaceinUsers(username, updatedWorkspaceArray).then(() => {
        console.log("workspace added to user");
        updateNotifications(username, notification)
          .then(() => {
            console.log("notification Updated");
            resolve(true);
          })
          .catch((error) => {
            console.error(error);
            reject(false);
          });
      });

      updateWorkspace(
        notification.workSpace.workspaceID,
        username,
        "Invitation accepted"
      )
        .then(() => {
          //this will update workspace in workspaces collection
          console.log("workspace collection updated");
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });
};

export default acceptInvitation;

export const rejectInvitation = (username, notification) => {
  return new Promise(async (resolve, reject) => {
    notification.isInvitationAccepted = false;
    notification.isInvitationExpired = true;
    notification.workSpace.members = [];
    notification.Body = "";

    updateNotifications(username, notification)
      .then(() => {
        console.log("notification Updated");
        resolve(true);
      })
      .catch((error) => {
        console.error("error in notification updatetion");
        reject(false);
      });

    updateWorkspace(
      notification.workSpace.workspaceID,
      username,
      "Invitation rejected"
    ).then(() => {
      //this will update workspace in workspaces collection
      //TODO: updated the members array

      console.log("workspace collection updated");
    });
  });
};
