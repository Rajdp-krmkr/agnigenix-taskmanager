"use client";
import React, { useCallback } from "react";
import realTimeUserSearch, {
  realTimeUserSearchForProject,
} from "@/Firebase Functions/realTimeUserSearch";
import { useEffect, useState } from "react";
import UsersOfSearchResults, {
  UsersOfSearchResultsForProject,
} from "./usersOfSearchResults";
// import { useSelector } from "react-redux";

const UserSearchResults = ({
  username,
  onUserSelect,
  showRoleSelector = false,
  roleOptions = [],
  excludeUsers = [],
}) => {
  const [searchresultsArray, setSearchResultsArray] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersArray, setUsersArray] = useState([]);
  const [selectedRole, setSelectedRole] = useState("view");

  const getSearchResults = useCallback(
    (searchQuery) => {
      //TODO change to lowercase
      const upperCasedSearchQuery = searchQuery.toUpperCase();

      const arr = [];

      if (searchQuery !== "") {
        for (let i = 0; i < usersArray.length; i++) {
          // Exclude already selected users
          if (excludeUsers.includes(usersArray[i].uid)) continue;

          if (
            usersArray[i].UpperCasedUsername.includes(upperCasedSearchQuery)
          ) {
            arr.push(usersArray[i]);
          } else if (
            usersArray[i].UpperCasedName.includes(upperCasedSearchQuery)
          ) {
            arr.push(usersArray[i]);
          }
        }
        setSearchResultsArray(arr);
      } else if (searchQuery == "") {
        setSearchResultsArray([]);
      }
    },
    [usersArray, excludeUsers]
  );

  useEffect(() => {
    getSearchResults(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        //TODO: use debounce
        const users = await realTimeUserSearch(); // Await the promise to resolve
        const modifiedUsers = users.map((user) => {
          return {
            ...user,
            UpperCasedName: user.name.toUpperCase(),
            UpperCasedUsername: user.username.toUpperCase(),
          };
        });
        console.log(modifiedUsers);
        setUsersArray(modifiedUsers); // Set the resolved data into the state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    console.log(usersArray);
  }, [usersArray]);

  return (
    <div className="">
      {showRoleSelector && roleOptions.length > 0 && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Access Level:
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <input
        type="text"
        id="search"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        className="outline-thm-clr-1 rounded-xl p-3 border-2 dark:border-gray-500 w-full dark:bg-gray-500 dark:text-gray-100 dark:placeholder:text-gray-100 bg-gray-100 placeholder:text-xs text-sm"
        placeholder="Type username or name"
      />
      <div className="overflow-auto w-[260px] searchResultScrollBar my-2 transition-all max-h-48">
        {searchresultsArray === null ? (
          <div className="loader w-9 h-9 border-[4px] border-white"></div>
        ) : searchresultsArray.length === 0 && searchQuery !== "" ? (
          <div className="text-center py-2 text-gray-400 text-sm">
            No results found
          </div>
        ) : (
          searchresultsArray.map((user, index) => {
            if (
              user.username !== username &&
              !excludeUsers.includes(user.uid)
            ) {
              return (
                <div key={index}>
                  <UsersOfSearchResults index={index} user={user} />
                </div>
                // <div
                //   key={index}
                //   onClick={() =>
                //     onUserSelect && onUserSelect(user, selectedRole)
                //   }
                //   className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border-b border-gray-200 dark:border-gray-700"
                // >
                // </div>
              );
            }
            return null;
          })
        )}
      </div>
    </div>
  );
};

export default UserSearchResults;

export const UserSearchResultsForProjects = ({
  username,
  workspaceMembersArray,
  onUserSelect,
  excludeUsers = [],
}) => {
  // const username = params.user;
  const [searchresultsArray, setSearchResultsArray] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [usersArray, setUsersArray] = useState([]);

  const getSearchResults = useCallback(
    (searchQuery) => {
      const upperCasedSearchQuery = searchQuery.toUpperCase();

      const arr = [];

      if (searchQuery !== "") {
        for (let i = 0; i < usersArray.length; i++) {
          // Exclude already selected users
          if (excludeUsers.includes(usersArray[i].uid)) continue;

          if (
            usersArray[i].UpperCasedUsername.includes(upperCasedSearchQuery)
          ) {
            arr.push(usersArray[i]);
          } else if (
            usersArray[i].UpperCasedName.includes(upperCasedSearchQuery)
          ) {
            arr.push(usersArray[i]);
          }
        }

        setSearchResultsArray(arr);
      } else if (searchQuery === "") {
        setSearchResultsArray([]);
      }
    },
    [usersArray, excludeUsers]
  );

  useEffect(() => {
    getSearchResults(searchQuery);
  }, [searchQuery, getSearchResults]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await realTimeUserSearchForProject(workspaceMembersArray); // Await the promise to resolve
        const modifiedUsers = users.map((user) => {
          return {
            ...user,
            UpperCasedName: user.name.toUpperCase(),
            UpperCasedUsername: user.username.toUpperCase(),
          };
        });
        console.log(modifiedUsers);
        setUsersArray(modifiedUsers); // Set the resolved data into the state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [workspaceMembersArray]);

  useEffect(() => {
    console.log(usersArray);
  }, [usersArray]);

  return (
    <>
      <div className="">
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={(e) => {
            // console.log(e.target.value);
            setSearchQuery(e.target.value);
          }}
          className="outline-thm-clr-1 rounded-xl p-3 border-2 dark:border-gray-500 w-full dark:bg-gray-500 dark:text-gray-100 dark:placeholder:text-gray-100 bg-gray-100 placeholder:text-xs text-sm"
          placeholder="Type username or name"
        />
        <div className="overflow-auto w-[260px] searchResultScrollBar my-2 transition-all max-h-48">
          {searchresultsArray === null ? (
            <div className="loader w-9 h-9 border-[4px] border-white"></div>
          ) : searchresultsArray.length === 0 && searchQuery !== "" ? (
            <div className="text-center py-2 text-gray-400 text-sm">
              No results found
            </div>
          ) : (
            searchresultsArray.map((user, index) => {
              if (
                user.username !== username &&
                !excludeUsers.includes(user.uid)
              ) {
                return (
                  <div
                    key={index}
                    onClick={() => onUserSelect && onUserSelect(user)}
                    className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border-b border-gray-200 dark:border-gray-700"
                  >
                    <UsersOfSearchResultsForProject
                      index={index}
                      user={user}
                      workspacearray={workspaceMembersArray}
                    />
                  </div>
                );
              }
            })
          )}
        </div>
      </div>
    </>
  );
};
