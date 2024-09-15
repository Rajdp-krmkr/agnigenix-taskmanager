import { updateNotifications } from "@/Firebase Functions/GetAndPostNotifications";
import React, { useEffect, useState } from "react";

const Notifications = ({ username, notification }) => {
  console.log("notification.jsx: ", notification);

  const [isNotificationRead, setIsNotificationRead] = useState(false);

  useEffect(() => {
    setIsNotificationRead(notification.isRead);
  }, [notification]);

  if (notification === null) return null;
  return (
    <>
      <div
        className={`flex flex-row items-center justify-between gap-16 border-b-2 p-2 ${
          isNotificationRead ? "bg-gray-100" : "bg-transparent"
        } hover:bg-gray-100 rounded-lg transition-all cursor-pointer`}
        onClick={() => {
          setIsNotificationRead(true);

          console.log(notification);
          updateNotifications(username, notification.uid)
            .then(() => {
              console.log("notification Updated");
              // window.location.reload();
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
        <div>
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
