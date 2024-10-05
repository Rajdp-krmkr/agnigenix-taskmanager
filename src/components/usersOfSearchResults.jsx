import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addInvitedUser, removeInvitedUser } from "@/lib/features/slice";

const UsersOfSearchResults = ({ user, index }) => {
  const dispatch = useDispatch();
  const InvitedUser = useSelector((state) => state.invitedUsers);

  const isUserInvited = InvitedUser.invitedUsers.some(
    (invitedUser) => invitedUser.username === user.username
  );

  useEffect(() => {
    console.log(isUserInvited);
  }, [isUserInvited]);

  const [invitingButtons, setInvitingButtons] = useState(false);

  return (
    <div
      key={index}
      className={`${
        isUserInvited
          ? "bg-gray-200 dark:bg-gray-700"
          : "bg-white dark:bg-gray-500"
      } cursor-pointer hover:shadow-md flex flex-row justify-between transition-all shadow-sm p-2 rounded-lg m-2`}
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
          <h2 className="text-[12px] font-bold dark:text-white">{user.name}</h2>
          {/* //TODO: loader component will be added*/}
          <p className="text-[10px] text-gray-400 dark:text-gray-300">
            {user.username}
          </p>
        </div>
      </div>
      <div className="w-10 flex gap-1 mx-2">
        {invitingButtons && !isUserInvited ? (
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
                    photoURL: user.photoURL,
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
        ) : (
          isUserInvited &&
          (!invitingButtons ? (
            <span className="px-1 font-semibold flex justify-center items-center rounded-lg text-xs text-center text-gray-400 border-2 border-gray-400">
              <span>Invited</span>
            </span>
          ) : (
            <>
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
          ))
        )}
      </div>
    </div>
  );
};

export default UsersOfSearchResults;

export const UsersOfSearchResultsForProject = ({
  user,
  index,
  workspaceMembersarray,
}) => {
  const dispatch = useDispatch();
  const InvitedUser = workspaceMembersarray;

  const isUserInvited = InvitedUser.invitedUsers.some(
    (invitedUser) => invitedUser.username === user.username
  );

  useEffect(() => {
    console.log(isUserInvited);
  }, [isUserInvited]);

  useEffect(() => {
    console.log("invitedUser: ", InvitedUser);
  }, [InvitedUser]);

  console.log("console: ", console);

  const [invitingButtons, setInvitingButtons] = useState(false);

  return (
    <div
      key={index}
      className={`${
        isUserInvited
          ? "bg-gray-200 dark:bg-gray-700"
          : "bg-white dark:bg-gray-500"
      } cursor-pointer hover:shadow-md flex flex-row justify-between transition-all shadow-sm p-2 rounded-lg m-2`}
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
          <h2 className="text-[12px] font-bold dark:text-white">{user.name}</h2>
          {/* //TODO: loader component will be added*/}
          <p className="text-[10px] text-gray-400 dark:text-gray-300">
            {user.username}
          </p>
        </div>
      </div>
      <div className="w-10 flex gap-1 mx-2">
        {invitingButtons && !isUserInvited ? (
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
                    photoURL: user.photoURL,
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
        ) : (
          isUserInvited &&
          (!invitingButtons ? (
            <span className="px-1 font-semibold flex justify-center items-center rounded-lg text-xs text-center text-gray-400 border-2 border-gray-400">
              <span>Invited</span>
            </span>
          ) : (
            <>
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
          ))
        )}
      </div>
    </div>
  );
};
