import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./authProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IoIosSend } from "react-icons/io";
import useGetData from "../functions/useGetData";
import { Spinner } from "keep-react";
const AllPlayers = () => {
  let navigate = useNavigate();
  const { socket, user, userLoading } = useContext(AuthContext);
  const { isPending, data } = useGetData("/users/all-users");
  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    socket?.on("online", (m) => {
      let { online } = m;
      let temp = [];
      for (let u in online) {
        temp.push({
          email: u,
          id: online[u]?.id,
          status: online[u]?.status,
        });
        // temp?.forEach((uu, i) => {
        //   if (uu?.email === u) {
        //     temp[i] = {
        //       ...temp[i],
        //       id: online[u]?.id,
        //       status: online[u]?.status,
        //     };
        //   }
        // });
      }
      temp.sort((a, b) => a?.email - b?.email);
      setOnlineUsers(temp);
    });
  }, [socket]);
  useEffect(() => {
    if (!isPending) {
      let temp = [...onlineUsers];
      data?.data?.forEach((u) => {
        let pos = -1;
        let check = false;
        temp.forEach((uu, i) => {
          if (uu?.email === u?.email) {
            pos = i;
            check = true;
          }
        });
        if (check) temp[pos] = { ...temp[pos], user: u };
        else temp.push({ user: u, email: u?.email, status: "offline", id: [] });
      });
      temp.sort((a, b) => a.email - b.email);
      let remaining = temp.filter((u) => u?.email !== user?.email);
      setAllUsers(remaining);
    }
  }, [isPending, onlineUsers]);
  console.log(allUsers);

  if (isPending || userLoading)
    return (
      <div className="w-full h-full flex justify-center items-center bg-[#f32853]">
        <div
          className="p-2 rounded-xl pr-4 bg-[#fee8ed] text-[#f32853]"
          size="md"
        >
          <span className="pr-2">
            <Spinner className="" color="pink" size="md" />
          </span>
          Loading...
        </div>
      </div>
    );

  return (
    <div className="flex-1 bg-[#fad459] rounded-xl overflow-y-auto p-2 space-y-2 w-full">
      {allUsers?.map(
        (u, i) =>
          u?.email !== user?.email && (
            <div
              key={i}
              className="p-2 rounded-2xl bg-[#fde8ed] flex justify-between items-center w-full gap-2"
              style={{ opacity: u?.status === "offline" ? 0.5 : 1 }}
            >
              <div className="flex gap-2 items-center">
                <img
                  className="h-10 object-cover object-center bg-black aspect-square rounded-full"
                  src={u?.user?.photoURL}
                  alt=""
                />
                <p
                  className="font-bold text-xs line-clamp-1"
                  style={{
                    color:
                      u?.status === "offline"
                        ? "black"
                        : u?.status === "busy"
                        ? "red"
                        : "green",
                  }}
                >
                  {u?.user?.displayName}
                </p>
              </div>
              {u?.status === "online" && (
                <button
                  className="focus:ring-0 focus:outline-none focus:border-0 bg-gradient-to-b p-1 from-[#f9d154] to-[#f6a71b] h-full aspect-square rounded-full flex justify-center items-center text-slate-900 font-bold text-sm"
                  onClick={() => {
                    socket.emit("invite", {
                      sender: user?.email,
                      reciever: u?.email,
                    });
                  }}
                >
                  <IoIosSend color="black" />
                </button>
              )}
            </div>
          )
      )}
    </div>
  );
};

export default AllPlayers;
