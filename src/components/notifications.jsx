import {
  updateWorkspace,
  updateWorkspaceinUsers,
} from "@/Firebase Functions/CreateWorkspace";
import { updateNotifications } from "@/Firebase Functions/GetAndPostNotifications";
import React, { useEffect, useState } from "react";
import acceptInvitation, { rejectInvitation } from "./accep&RejectInvitation";

const Notifications = ({ username, notification }) => {
  // console.log("notification.jsx: ", notification);

  const [isNotificationRead, setIsNotificationRead] = useState(false);
  const [isInvitationAccepted, setIsInvitationAccepted] = useState(null);
  const [isInvitationExpired, setIsInvitationExpired] = useState(null);

  useEffect(() => {
    setIsNotificationRead(notification.isRead);
    if (notification.Type === "invitation") {
      setIsInvitationExpired(notification.isInvitationExpired);
      setIsInvitationAccepted(notification.isInvitationAccepted);

      if (notification.isInvitationAccepted === null) {
        const isExpired = () => {
          const currentTime = new Date();
          const hour = currentTime.getHours();
          const date = currentTime.getDate();
          const month = currentTime.getMonth() + 1;
          const year = currentTime.getFullYear();

          if (
            date > notification.invitationExpirationDate.date ||
            month > notification.invitationExpirationDate.month ||
            year > notification.invitationExpirationDate.year
          ) {
            return true;
          } else if (
            date === notification.invitationExpirationDate.date &&
            month === notification.invitationExpirationDate.month &&
            year === notification.invitationExpirationDate.year
          ) {
            return false;
          }
        };

        if (notification.isInvitationExpired === false) {
          // is invitation accepted --> null
          setIsInvitationExpired(isExpired());

          if (isExpired()) {
            notification.isInvitationExpired = isExpired();

            updateWorkspace(
              notification.workSpace.workspaceID,
              username,
              "Invitation expired"
            ).then(() => {
              console.log("workspace collection updated");

              notification.Body = "";

              updateNotifications(username, notification)
                .then(() => {
                  console.log("notification Updated with Body: '' ");
                })
                .catch((error) => {
                  console.log(error);
                });
            });
          }
        }
      } else {
        setIsInvitationExpired(true);
      }
    }
  }, [notification]);

  useEffect(() => {
    if (isInvitationExpired) {
      updateNotifications(username, notification)
        .then(() => {
          console.log("notification Updated");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isInvitationExpired]);

  if (notification === null) return null;
  return (
    <>
      <div
        className={`flex flex-row items-center justify-between gap-16 border-b-2 p-2 ${
          isNotificationRead ? "bg-gray-100" : "bg-transparent"
        } hover:bg-gray-100 rounded-lg transition-all cursor-pointer`}
        onClick={() => {
          setIsNotificationRead(true);

          notification.isRead = true;
          console.log(notification);

          updateNotifications(username, notification)
            .then(() => {
              console.log("notification Updated");
            })
            .catch((error) => {
              console.error(error);
            });
        }}
      >
        <div className="flex flex-col ">
          <div className="flex flex-row justify-between items-center">
            <div className="font-bold">{notification.Title}</div>
            <div className="text-xs ml-2 text-gray-400">
              {notification.Time}
            </div>
          </div>
          <div className="text-sm text-gray-500">{notification.Body}</div>
        </div>
        <div className="flex items-center gap-10">
          <div className="acceptorRejectButton flex gap-5">
            {notification.Type === "invitation" ? (
              isInvitationAccepted ? (
                <span className="text-blue-500 font-semibold text-sm">
                  Invitation accepted
                </span>
              ) : isInvitationAccepted === false ? (
                <span className="text-red-500 font-semibold text-sm">
                  Invitation rejected
                </span>
              ) : isInvitationAccepted === null && !isInvitationExpired ? (
                <>
                  <button
                    className="p-2 px-5 text-sm rounded-lg bg-blue-500 transition-all font-semibold hover:bg-blue-600 text-white"
                    onClick={() => {
                      acceptInvitation(username, notification)
                        .then((res) => {
                          console.log("Invitation Accepted");
                          setIsInvitationAccepted(res);
                        })
                        .catch((error) => {
                          setIsInvitationAccepted(error);
                          console.error(" error in accepting invitation");
                        });
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="p-2 px-5 text-sm rounded-lg bg-red-500 transition-all font-semibold hover:bg-red-600 text-white"
                    onClick={() => {
                      rejectInvitation(username, notification).then(() => {
                        console.log("Invitation Rejected");
                      });
                    }}
                  >
                    Reject
                  </button>
                </>
              ) : (
                isInvitationAccepted === null &&
                isInvitationExpired && (
                  <span className="text-gray-400 font-semibold text-sm">
                    Invitation expired
                  </span>
                )
              )
            ) : (
              <></>
            )}
          </div>
          <div
            className={`rounded-full ${
              isNotificationRead ? "bg-transparent" : "bg-red-500"
            } w-2 h-2`}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
