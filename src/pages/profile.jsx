import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/authProvider";
import { Check } from "phosphor-react";
import { Button, Modal, Spinner, Typography } from "keep-react";
import useGetData from "../functions/useGetData";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import PageTitle from "../components/pageTitle";
import { RxExit } from "react-icons/rx";
import Swal from "sweetalert2";
const Profile = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(null);
  const { socket, user, setUser, setSocket, logOut, setUserLoading } =
    useContext(AuthContext);
  const { data, isPending } = useGetData(
    "/games/my-games?email=" + user?.email
  );

  const handleLogout = () => {
    logOut()
      .then(() => {
        socket.close();
        setSocket(null);
        setUser(null);
        setUserLoading(false);
        Swal.fire("Successfully logged out");
      })
      .catch(() => {
        socket.close();
        setSocket(null);
        setUser(null);
        setUserLoading(false);
        Swal.fire("Successfully logged out");
      });
  };

  useEffect(() => {
    if (socket) {
      socket.emit("get-free", user);
    }
  }, [socket]);

  if (!isPending) console.log(Object.values(data?.data));
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-[#f32853] bg-[#fee8ed] pt-10 p-5 gap-5">
      <PageTitle>Profile</PageTitle>
      {/* <Link className="" to={"/profile"}> */}
      <img
        className="border-2 border-[#f32853] rounded-full w-1/4 object-center object-cover aspect-square bg-black"
        src={user?.photoURL}
        alt=""
      />
      {/* </Link> */}
      <p className="mb-5 font-semibold">{user?.displayName}</p>
      <div className="flex-1 bg-[#f32853] rounded-xl overflow-y-auto p-2 space-y-2 w-full flex justify-center items-center flex-col">
        {isPending ? (
          <div
            className="p-2 rounded-xl pr-4 bg-[#fee8ed] text-[#f32853]"
            size="md"
          >
            <span className="pr-2">
              <Spinner className="" color="pink" size="md" />
            </span>
            Loading...
          </div>
        ) : (
          <div className="w-full flex-1 p-2">
            {Object.values(data?.data).map((u) => (
              <Row
                u={u}
                key={u?.opponent?._id}
                open={isOpen}
                setOpen={setIsOpen}
              />
            ))}
          </div>
        )}
        {/* <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen} /> */}
      </div>
      <div className="flex gap-5 w-full items-center">
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-b from-[#f9d154] to-[#f6a71b] flex-1 p-3 rounded-xl flex justify-center items-center text-[#755216] font-bold text-xl focus:border-0"
        >
          <IoHomeOutline />
        </button>
        <button
          onClick={() => handleLogout()}
          className="bg-gradient-to-b from-[#f9d154] to-[#f6a71b] flex-1 p-3 rounded-xl flex justify-center items-center text-[#755216] font-bold text-xl focus:border-0"
        >
          <RxExit />
        </button>
      </div>
    </div>
  );
};

export default Profile;

// const ModalContainer = ({ isOpen, setIsOpen }) => {
//   return (
//     <Modal isOpen={isOpen}>
//       <Modal.Body className="flex flex-col items-center h-3/4 aspect-[1080/1920]">
//         {/* <Modal.Icon className="h-20 w-20 bg-success-50 text-success-500">
//           <Check size={60} />
//         </Modal.Icon> */}
//         {/* <Modal.Content className="my-4 text-center">
//           <Typography
//             variant="h3"
//             className="mb-2 text-body-1 font-bold text-metal-900"
//           >
//             Payment Successful
//           </Typography>
//           <Typography
//             variant="p"
//             className="text-body-4 font-normal text-metal-600"
//           >
//             Your document has unsaved changes. Discard or save them as a new
//             page to continue.
//           </Typography>
//         </Modal.Content> */}
//       </Modal.Body>
//     </Modal>
//   );
// };

const Row = ({ u, open, setOpen }) => {
  const { user } = useContext(AuthContext);
  // const [open, setOpen] = useState(false);
  const heightRef = useRef(null);
  console.log(u);
  return (
    <>
      <div
        className="cursor-pointer rounded-xl p-2 flex items-center gap-3"
        style={{
          backgroundColor: open === u?.opponent?.email ? "#fad459" : "#fee8ed",
        }}
        onClick={() => setOpen((prev) => (prev ? null : u?.opponent?.email))}
      >
        <img
          className="h-7 aspect-square object-cover object-center rounded-full "
          src={u?.opponent?.photoURL}
        ></img>
        <p className="line-clamp-1 text-xs font-bold">
          {u?.opponent?.displayName}
          {/* {open === u?.opponent?.email ? "true" : "false"} */}
        </p>
        <div className="flex-1 justify-end flex">
          <IoIosArrowDropdown
            className={`${
              open === u?.opponent?.email ? "rotate-180" : "rotate-0"
            } transition-all duration-300`}
          />
        </div>
      </div>
      <div
        className={` transition-all duration-300 my-3`}
        style={{
          height: open === u?.opponent?.email ? 150 : 0,
          overflow: open === u?.opponent?.email ? "auto" : "hidden",
        }}
      >
        <div ref={heightRef} className="h-fit space-y-3  pl-5">
          {u?.games?.map((g) => (
            <div
              key={g?._id}
              className={`w-full ${
                g?.winner
                  ? g?.winner === user?.email
                    ? "bg-green-300 text-green-600"
                    : "bg-red-300 text-red-600"
                  : "bg-blue-300 text-blue-600"
              } p-2 rounded-xl flex justify-between`}
            >
              <div className="space-y-1 pt-2">
                <p className="line-clamp-1 text-xs font-bold ">
                  {new Date(g?.time).toLocaleDateString()}
                  {/* {open === u?.opponent?.email ? "true" : "false"} */}
                </p>
                <p className="line-clamp-1 text-xs font-bold ">
                  {new Date(g?.time).toLocaleTimeString()}
                  {/* {open === u?.opponent?.email ? "true" : "false"} */}
                </p>
                <p className="text-xl italic pl-2">
                  {g?.winner
                    ? g?.winner === user?.email
                      ? "WIN"
                      : "LOSS"
                    : "DRAW"}
                </p>
              </div>
              <DummyBoard board={g?.board} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const DummyBoard = ({ board }) => {
  return (
    <div className="divide-y-2 font-bold">
      {board?.map((r, idr) => (
        <div className="divide-x-2 flex" key={idr}>
          {r?.map((c, idc) => (
            <div
              className="flex w-5 aspect-square justify-center items-center"
              key={idc}
            >
              {c == 1 ? "x" : c == 2 ? "o" : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
