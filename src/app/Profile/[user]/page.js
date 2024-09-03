"use client";
import GetUserData, {
  GetUserDataByUsername,
} from "@/Firebase Functions/GetuserData";
import StoreUserData from "@/Firebase Functions/StoreUserData";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const params = useParams();
  const username = params.user;
  console.log(username);

  const [user, setUser] = useState(false);
  const [photoURL, setPhotoURL] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [socialAcounts, setSocialAcounts] = useState([]);

  useEffect(() => {
    GetUserDataByUsername({ username }).then((res) => {
      setUser(res);
      setPhotoURL(res.photoURL);
      console.log(res);
      setName(res.name);
      setBio(res.bio);
      setEmail(res.email);
      setJobRole(res.jobRole);
      setSocialAcounts(res.socialMediaAcounts);
    });
  }, []);

  return (
    <>
      <div className="mt-7 lg:ml-[270px] lg:mr-[180px] m-10 flex flex-col justify-center items-center">
        {user == false ? (
          <div class="typewriter absolute top-[40vh] self-center">
            <div class="slide">
              <i></i>
            </div>
            <div class="paper"></div>
            <div class="keyboard"></div>
          </div>
        ) : (
          <>
            <div className="m-2 w-full">
              <h1 className="text-2xl font-bold mx-12">Profile</h1>
            </div>
            <div className="w-[90%] min-h-[80vh] flex flex-row gap-7 mx-20 m-5">
              <div className="flex w-[50%] h-max rounded-3xl flex-col gap-2 bg-gray-100 ">
                <div className="photos h-[190px] ">
                  <div className="coverPhoto relative w-full h-36 bg-black rounded-t-3xl">
                    {coverPhoto ? (
                      <Image
                        src={coverPhoto}
                        fill
                        className="rounded-t-3xl bg-cover"
                        alt="cover-photo"
                      />
                    ) : null}
                  </div>
                  <div className="absolute w-24 h-24 top-[210px] ml-7">
                    <Image
                      src={photoURL}
                      width={70}
                      height={70}
                      className="rounded-3xl border-2 border-white"
                      alt="profile-photo"
                    />
                  </div>
                </div>
                <div className="name&Username ml-7 mb-5">
                  <h2 className="font-bold">{name}</h2>
                  <span className="text-xs text-gray-500">{username}</span>
                </div>
                <div className="bio mx-6 my-5 min-h-[20%]">
                  <span className="font-bold py-2">Bio</span>
                  <p
                    className={` min-h-[10%] rounded-lg p-2 text-gray-400 text-xs`}
                  >
                    {bio == "" ? "Click on edit and write a bio" : bio}
                  </p>
                  {/* <div className="w-full h-[2px] bg-gray-300 my-4"></div> */}
                </div>
              </div>
              <div className="flex w-[50%] h-[50%] flex-col gap-5">
                <div className="flex rounded-3xl flex-col gap-2 bg-gray-100 p-4">
                  <h1 className="font-bold">Personal information</h1>
                  <div>
                    <div className="w-full">
                      <h3 className="text-xs font-semibold">Email address</h3>
                      <p className="text-xs text-gray-400">
                        {email === "" || email === null
                          ? "No email found, please enter an email"
                          : email}
                      </p>
                    </div>
                    <div className="w-full my-3">
                      <h3 className="text-xs font-semibold">Job role</h3>
                      <p className="text-xs text-gray-400">
                        {jobRole === "" || jobRole === null
                          ? "No job role added, Enter a job role"
                          : jobRole}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex rounded-3xl flex-col gap-2 bg-gray-100 p-4">
                  <h1 className="font-bold">Social Media accounts</h1>
                  <div>
                    {socialAcounts.length === 0 ? (
                      <>
                        <p className="text-xs text-gray-400">
                          No social media accounts found
                        </p>
                        <p className="text-xs text-gray-400">
                          Click on edit to add social media accounts
                        </p>
                      </>
                    ) : (
                      socialAcounts.map((account) => {
                        <div className="text-xs text-gray-400 p-2 rounded-lg bg-white border-2 my-2 w-full">
                          <span>{account}</span>
                        </div>;
                      })
                    )}
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default page;
