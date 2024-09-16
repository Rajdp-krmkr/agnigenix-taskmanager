import Image from "next/image";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addInvitedUser, removeInvitedUser } from "@/lib/features/slice";

const UsersOfSearchResults = ({ user, index }) => {
  const dispatch = useDispatch();

  const [invitingButtons, setInvitingButtons] = useState(false);

  return (
    <div
      key={index}
      className="bg-white cursor-pointer hover:shadow-md flex flex-row justify-between transition-all shadow-sm p-2 rounded-lg m-2"
      onClick={() => {
        setInvitingButtons(!invitingButtons);
      }}
    >
      <div className="flex flex-row gap-2 items-center">
        <div className="profilePhoto relative w-7 h-7 ">
          <Image
            src={user.photoURL}
            className="rounded-2xl"
            fill
            alt="profile-picture"
          />
          {/* //TODO: account svg will be added */}
        </div>
        <div className="flex flex-col">
          <h2 className="text-[12px] font-bold">{user.name}</h2>
          {/* //TODO: loader component will be added*/}
          <p className="text-[10px] text-gray-400">{user.username}</p>
        </div>
      </div>
      <div className="w-10 flex gap-1 mx-2">
        {invitingButtons && (
          <>
            <button
              className="hover:scale-110"
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  addInvitedUser({
                    name: user.name,
                    username: user.username,
                    isAdmin: false,
                    uid: user.uid,
                    isPendingInvitation: true,
                    isInvitationAccepted: null,
                  })
                );
                setInvitingButtons(false);
              }}
            >
              ✅
            </button>
            <button
              className="hover:scale-110"
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  removeInvitedUser({
                    username: user.username,
                  })
                );
                setInvitingButtons(false);
              }}
            >
              ❌
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UsersOfSearchResults;
