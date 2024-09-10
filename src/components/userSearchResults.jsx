"use client";
import React from "react";
import realTimeUserSearch from "@/Firebase Functions/realTimeUserSearch";
import { useEffect, useState } from "react";
import Image from "next/image";

const UserSearchResults = ({ username }) => {
  // const username = params.user;
  const [searchresultsArray, setSearchResultsArray] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [usersArray, setUsersArray] = useState([]);

  const getSearchResults = (searchQuery) => {
    const upperCasedSearchQuery = searchQuery.toUpperCase();

    const arr = [];

    if (searchQuery !== "") {
      for (let i = 0; i < usersArray.length; i++) {
        if (usersArray[i].UpperCasedUsername.includes(upperCasedSearchQuery)) {
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
  };

  useEffect(() => {
    getSearchResults(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
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
          className="outline-thm-clr-1 rounded-xl p-3 border-2 bg-gray-100 placeholder:text-xs text-sm"
          placeholder="Type username or name"
        />
        <div className="overflow-auto searchResultScrollBar my-2 transition-all">
          {searchresultsArray === null ? (
            <div className="loader w-9 h-9 border-[4px] border-white"></div>
          ) : searchresultsArray.length === 0 && searchQuery !== "" ? (
            <div className="text-center py-2 text-gray-400 text-sm">
              No results found
            </div>
          ) : (
            searchresultsArray.map((user) => {
              if (user.username !== username) {
                return (
                  <>
                    <div className="bg-white cursor-pointer hover:shadow-md transition-all shadow-sm flex flex-row items-center gap-2 p-2 rounded-lg m-2">
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
                        <p className="text-[10px] text-gray-400">
                          {user.username}
                        </p>
                      </div>
                    </div>
                  </>
                );
              }
            })
          )}
        </div>
      </div>
    </>
  );
};

export default UserSearchResults;
