"use client";
import React, { useCallback, useMemo, memo } from "react";
import realTimeUserSearch, {
  realTimeUserSearchForProject,
} from "@/Firebase Functions/realTimeUserSearch";
import { useEffect, useState } from "react";
import UsersOfSearchResults, {
  UsersOfSearchResultsForProject,
} from "./usersOfSearchResults";
import useDebounce from "@/Firebase Functions/useDebounce";
// import { useSelector } from "react-redux";

const UserSearchResults = memo(({
  username,
  onUserSelect,
  showRoleSelector = false,
  roleOptions = [],
  excludeUsers = [],
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("view");
  
  // Debounce search query to avoid excessive processing
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoize role options to prevent unnecessary re-renders
  const memoizedRoleOptions = useMemo(() => roleOptions, [roleOptions]);

  // Optimized search function that only searches when needed
  const searchUsers = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Use optimized Firebase function with search query and options
      const users = await realTimeUserSearch(query, { limit: 50 });
      
      const filteredUsers = users
        .filter(user => {
          // Exclude current user and already selected users
          return user.username !== username && !excludeUsers.includes(user.uid);
        })
        .slice(0, 20) // Additional client-side limit for UI performance
        .map(user => ({
          ...user,
          UpperCasedName: user.name.toUpperCase(),
          UpperCasedUsername: user.username.toUpperCase(),
        }));

      setSearchResults(filteredUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [username, excludeUsers]);

  // Search only when debounced query changes
  useEffect(() => {
    searchUsers(debouncedSearchQuery);
  }, [debouncedSearchQuery, searchUsers]);

  return (
    <div className="w-full max-w-sm">
      {showRoleSelector && memoizedRoleOptions.length > 0 && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Access Level:
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
          >
            {memoizedRoleOptions.map((role) => (
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
        placeholder="Type at least 2 characters to search..."
      />
      <div className="overflow-auto w-full max-w-sm searchResultScrollBar my-2 transition-all max-h-48">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="loader w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : searchQuery.length > 0 && searchQuery.length < 2 ? (
          <div className="text-center py-2 text-gray-400 text-sm">
            Type at least 2 characters
          </div>
        ) : searchResults.length === 0 && searchQuery.length >= 2 ? (
          <div className="text-center py-2 text-gray-400 text-sm">
            No users found
          </div>
        ) : (
          searchResults.map((user, index) => {
            if (
              user.username !== username &&
              !excludeUsers.includes(user.uid)
            ) {
              return (
                <div key={user.uid}>
                  <UsersOfSearchResults index={index} user={user} />
                </div>
              );
            }
            return null;
          })
        )}
      </div>
    </div>
  );
});

UserSearchResults.displayName = 'UserSearchResults';

export default UserSearchResults;

export const UserSearchResultsForProjects = memo(({
  username,
  workspaceMembersArray,
  onUserSelect,
  excludeUsers = [],
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersArray, setUsersArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const getSearchResults = useCallback(
    (searchQuery) => {
      const upperCasedSearchQuery = searchQuery.toUpperCase();
      const arr = [];

      if (searchQuery !== "") {
        for (let i = 0; i < usersArray.length; i++) {
          // Exclude already selected users
          if (excludeUsers.includes(usersArray[i].uid)) continue;

          if (
            usersArray[i].UpperCasedUsername.includes(upperCasedSearchQuery) ||
            usersArray[i].UpperCasedName.includes(upperCasedSearchQuery)
          ) {
            arr.push(usersArray[i]);
          }
        }
        setSearchResults(arr.slice(0, 20)); // Limit results
      } else {
        setSearchResults([]);
      }
    },
    [usersArray, excludeUsers]
  );

  useEffect(() => {
    getSearchResults(debouncedSearchQuery);
  }, [debouncedSearchQuery, getSearchResults]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const users = await realTimeUserSearchForProject(workspaceMembersArray);
        const modifiedUsers = users.map((user) => ({
          ...user,
          UpperCasedName: user.name.toUpperCase(),
          UpperCasedUsername: user.username.toUpperCase(),
        }));
        setUsersArray(modifiedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (workspaceMembersArray && workspaceMembersArray.length > 0) {
      fetchUsers();
    }
  }, [workspaceMembersArray]);

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
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="loader w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : searchResults.length === 0 && searchQuery !== "" ? (
            <div className="text-center py-2 text-gray-400 text-sm">
              No results found
            </div>
          ) : (
            searchResults.map((user, index) => {
              if (
                user.username !== username &&
                !excludeUsers.includes(user.uid)
              ) {
                return (
                  <div
                    key={user.uid}
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
              return null;
            })
          )}
        </div>
      </div>
    </>
  );
});

UserSearchResultsForProjects.displayName = 'UserSearchResultsForProjects';
