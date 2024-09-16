"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import GetNotifications, {
  updateNotifications,
} from "@/Firebase Functions/GetAndPostNotifications";
import Notifications from "@/components/notifications";
import Link from "next/link"; //! don't remove Link

const Page = () => {
  const params = useParams();
  const username = params.user;
  const [AllNotifications, setAllNotifications] = useState(null);

  useEffect(() => {
    GetNotifications(username)
      .then((notifications) => {
        console.log(notifications);
        const arr = [];
        if (notifications !== undefined) {
          for (let i = 0; i < notifications.length; i++) {
            arr.push(notifications[i]);
          }
        }
        console.log(arr);
        setAllNotifications(arr);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (AllNotifications === null) return;
    // console.log(AllNotifications);
  }, [AllNotifications]);

  return (
    <>
      <div className="mt-7 lg:ml-[210px] lg:mr-[180px] m-10 flex flex-col justify-center items-">
        <div className="">
          <h1 className="text-2xl font-bold mx-12">Notifications</h1>
        </div>
        <div className="flex flex-row mt-3 ml-[50px] ">
          <div className=" w-full">
            {AllNotifications === null ? (
              <div className="loader w-10 h-10"></div>
            ) : AllNotifications.length === 0 ? (
              <div className="text-center">No Notifications</div>
            ) : (
              AllNotifications.map((notification, index) => {
                // console.log(notification);
                return (
                  <>
                    <div key={index}>
                      <Notifications
                        username={username}
                        notification={notification}
                      />
                    </div>
                  </>
                );
              })
            )}
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default Page;
