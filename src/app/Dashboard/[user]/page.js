"use client";
import ThemeToggle from "@/components/ThemeToggle";
import { GetUserDataByUsername } from "@/Firebase Functions/GetuserData";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const username = params.user;
  console.log("username", username);

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
      <div className="mt-7 lg:ml-[240px] lg:mr-[180px] m-10 flex justify-center items-center">
        <div className="m-2 w-full">
          <h1
            className="text-2xl font-bold mx-12 cursor-pointer"
            onClick={() => {
              router.push(`/Dashboard/${username}`);
            }}
          >
            Dashboard
          </h1>
          <div className="h-full">
            <span>Page is under construction</span>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </>
  );
};

export default Page;
