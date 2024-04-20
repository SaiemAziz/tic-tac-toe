import React, { useContext, useEffect } from "react";
import { AuthContext } from "../components/authProvider";
import AllPlayers from "../components/allPlayers";
import { Link } from "react-router-dom";
import PageTitle from "../components/pageTitle";

const PlayersList = () => {
  const { socket, user } = useContext(AuthContext);
  useEffect(() => {
    if (socket) {
      socket.emit("get-free", user);
    }
  }, [socket]);
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#f32853] pt-10 p-5 gap-5">
      <PageTitle>Players</PageTitle>
      <Link className="w-1/4" to={"/profile"}>
        <img
          className="border-2 border-white rounded-full w-full object-center object-cover aspect-square bg-black"
          src={user?.photoURL}
          alt=""
        />
      </Link>
      <p className="mb-5 font-semibold text-[#fde8ed]">{user?.displayName}</p>
      <AllPlayers />
    </div>
  );
};

export default PlayersList;
