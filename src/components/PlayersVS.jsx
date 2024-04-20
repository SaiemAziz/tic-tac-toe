import React, { useContext } from "react";
import { AuthContext } from "./authProvider";
import { Cross, Round } from "./board";
import useGetData from "../functions/useGetData";

const PlayersVS = ({ opponent, sender }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex mx-auto w-4/5 justify-between gap-3 items-center ">
      <div className="w-2/5 aspect-square bg-white rounded-2xl shadow-2xl flex flex-col items-center gap-2">
        <img
          className="border-4 border-white w-1/2 aspect-square -mt-[25%] bg-black rounded-full"
          src={user?.photoURL}
          alt=""
        />
        <p className="text-slate-900 text-xs font-bold line-clamp-1 w-2/3 text-center">
          {user?.displayName}
        </p>
        <div className="w-1/2  flex justify-center rounded-2xl items-center aspect-[16/12] bg-[#f22853]">
          {sender ? <Cross /> : <Round />}
        </div>
      </div>
      <div className="bg-gradient-to-b from-[#f9d154] to-[#f6a71b] w-1/5 aspect-square rounded-full flex justify-center items-center text-slate-900 font-bold text-xl">
        <p>VS</p>
      </div>

      <div className="w-2/5 aspect-square bg-white rounded-2xl shadow-2xl flex flex-col items-center gap-2">
        <img
          className="border-4 border-white w-1/2 aspect-square -mt-[25%] bg-black rounded-full"
          src={opponent?.photoURL}
          alt=""
        />
        <p className="text-slate-900 text-xs font-bold line-clamp-1 w-2/3 text-center">
          {opponent?.displayName}
        </p>
        <div className="w-1/2  flex justify-center rounded-2xl items-center aspect-[16/12] bg-[#f22853]">
          {!sender ? <Cross /> : <Round />}
        </div>
      </div>
    </div>
  );
};

export default PlayersVS;
