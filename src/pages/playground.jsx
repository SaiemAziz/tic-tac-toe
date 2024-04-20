import React, { useContext, useEffect, useState } from "react";
import Board from "../components/board";
import PlayersVS from "../components/PlayersVS";
import { AuthContext } from "../components/authProvider";
import { useLocation, useNavigate } from "react-router-dom";
import useGetData, { backendURL } from "../functions/useGetData";
import { IoHomeOutline } from "react-icons/io5";
import { VscDebugRestart } from "react-icons/vsc";
import Swal from "sweetalert2";
import PageTitle from "../components/pageTitle";
import { Spinner } from "keep-react";
const Playground = () => {
  const params = useLocation();
  const navigate = useNavigate();
  // console.log("test", params?.state);
  const { user, socket } = useContext(AuthContext);
  const opponent =
    user?.email === params?.state?.sender
      ? params?.state?.reciever
      : params?.state?.sender;
  const [player1, setPlayer1] = useState(true);
  const [moves, setMoves] = useState(0);
  const [winner, setWinner] = useState("");
  const [board, setBoard] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  const [end, setEnd] = useState(false);
  const { data, isPending } = useGetData(
    `/users/single-user?email=${opponent}`
  );
  console.log(params);

  useEffect(() => {
    if (!params) return navigate("/");
  }, [params]);

  useEffect(() => {
    if (!socket) return;
    socket.on("next-state", (m) => {
      // console.log(m);
      setPlayer1(m?.player1);
      setWinner(m?.winner);
      setBoard(m?.board);
      setMoves(m?.moves);
    });
    socket.on("declaration", (m) => {
      console.log(m);
    });
    socket.off("send-invitation");
    socket.emit("get-busy", { email: user?.email });
    socket.on("restart-request-send", (m) => {
      console.log(m);
      if (m?.req !== user?.email)
        Swal.fire({
          title: "Restart?",
          text: "Opponent requested for restart",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Accept",
        }).then((result) => {
          if (result.isConfirmed !== undefined)
            socket?.emit("restart-request-response", {
              ...m,
              response: result.isConfirmed,
            });
        });
    });
    socket.on("restart-request-responded", (m) => {
      if (m?.req === user?.email) {
        Swal.fire(m?.response ? "Game restarted" : "Request rejected");
        if (m?.response) handleTick(0, 0, true);
      }
    });
    socket.on("opponent-left", (m) => {
      // if (m?.left === user?.email) return;
      // console.log("inside opponent left");
      Swal.fire("Opponent left");
      navigate("/");
    });
    return () => {
      socket?.on("send-invitation", (m) => {
        if (user?.email !== m?.reciever) return;
        Swal.fire({
          title: "Are you sure?",
          text: "You wanna play a game with Mr.x?",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Accept",
        }).then((result) => {
          if (result.isConfirmed) {
            socket?.emit("accept", m);
          }
        });
      });
      socket.off("opponent-left");
      // socket.emit("left", { ...params?.state, left: user?.email });
      socket.emit("get-free", { ...params?.state, email: user?.email });
    };
  }, [socket]);

  //   console.log("board: ", board);
  const handleTick = (idr, idcell, restarted = false) => {
    if (restarted) {
      setEnd(false);
      socket.emit("moves", {
        board: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        winner: "",
        player1: player1,
        moves: moves,
        ...params?.state,
      });
      return;
    }
    if (winner) return;

    if (player1) {
      if (board[idr][idcell] === 0) {
        let temp = [...board];
        // console.log("temp: ", temp);
        temp[idr][idcell] = 1;
        socket.emit("moves", {
          board: temp,
          winner: winner,
          player1: player1,
          moves: 0,
          ...params?.state,
        });
        // setBoard(temp);
        // setPlayer1((prev) => !prev);
        // setMoves((prev) => prev + 1);
      }
    } else {
      if (board[idr][idcell] === 0) {
        let temp = [...board];
        // console.log("temp: ", temp);
        temp[idr][idcell] = 2;
        socket.emit("moves", {
          board: temp,
          winner: winner,
          player1: player1,
          moves: moves,
          ...params?.state,
        });
        // setBoard(temp);
        // setPlayer1((prev) => !prev);
        // setMoves((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (winner) {
      if (end || user?.email !== params?.state?.sender) return;
      setEnd(true);
      // fetch(backendURL + "/games/insert-game", {
      //   method: "POST",
      //   headers: {
      //     "content-type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     sender: params?.state?.sender,
      //     reciever: params?.state?.reciever,
      //     time: Date.now(),
      //     board: board,
      //     winner: winner,
      //   }),
      // })
      //   .then((r) => r.json())
      //   .then(() => {
      //     // next work
      //   });
      socket.emit("game-ended", {
        sender: params?.state?.sender,
        reciever: params?.state?.reciever,
        time: Date.now(),
        board: board,
        winner: winner,
      });
    }
  }, [winner, end]);

  useEffect(() => {
    let finalSum = !player1 ? 3 : 6;
    let win = "";
    // check diagonal
    if (
      (board[0][0] || -1000) +
        (board[1][1] || -1000) +
        (board[2][2] || -1000) ==
      finalSum
    )
      win = !player1 ? "p1" : "p2";
    else if (
      (board[2][0] || -1000) +
        (board[1][1] || -1000) +
        (board[0][2] || -1000) ==
      finalSum
    )
      win = !player1 ? "p1" : "p2";
    // check row wise
    else if (
      (board[0][0] || -1000) +
        (board[0][1] || -1000) +
        (board[0][2] || -1000) ==
      finalSum
    )
      win = !player1 ? "p1" : "p2";
    else if (
      (board[1][0] || -1000) +
        (board[1][1] || -1000) +
        (board[1][2] || -1000) ==
      finalSum
    )
      win = !player1 ? "p1" : "p2";
    else if (
      (board[2][0] || -1000) +
        (board[2][1] || -1000) +
        (board[2][2] || -1000) ==
      finalSum
    )
      win = !player1 ? "p1" : "p2";
    // check column wise
    else if (
      (board[0][0] || -1000) +
        (board[1][0] || -1000) +
        (board[2][0] || -1000) ==
      finalSum
    )
      win = !player1 ? "p1" : "p2";
    else if (
      (board[0][1] || -1000) +
        (board[1][1] || -1000) +
        (board[2][1] || -1000) ==
      finalSum
    )
      win = !player1 ? "p1" : "p2";
    else if (
      (board[0][2] || -1000) +
        (board[1][2] || -1000) +
        (board[2][2] || -1000) ==
      finalSum
    )
      win = !player1 ? "p1" : "p2";
    else {
      let finished = true;
      board.flat().forEach((e) => {
        if (finished) finished = e === 0 ? false : true;
      });
      win = finished ? "draw" : "";
    }
    // console.log("winner : ", win, finalSum);
    if (win) {
      setWinner(win);
    }
    if (win && win !== "draw") setPlayer1((prev) => !prev);
  }, [moves]);
  // console.log(winner);

  // const handleRestart = () => {
  //   Swa;
  // };

  if (isPending)
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
    <div className="h-full w-full flex flex-col py-10 items-center bg-[#fdeef0] justify-between">
      <PageTitle>Board</PageTitle>
      <PlayersVS
        opponent={data?.data}
        sender={user?.email === params?.state?.sender}
      />
      <Board
        board={board}
        handleTick={handleTick}
        winner={winner}
        sender={user?.email === params?.state?.sender}
        player1={player1}
      />
      <Bottom
        winner={winner}
        sender={user?.email === params?.state?.sender}
        player1={player1}
      />
      <div className="flex gap-5 w-full px-5">
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-b from-[#f9d154] to-[#f6a71b] flex-1 p-3 rounded-xl flex justify-center items-center text-[#755216] font-bold text-xl focus:border-0"
        >
          <IoHomeOutline />
        </button>
        <button
          onClick={() =>
            socket.emit("restart-request", {
              ...params?.state,
              req: user?.email,
            })
          }
          className="bg-gradient-to-b from-[#f9d154] to-[#f6a71b] flex-1 p-3 rounded-xl flex justify-center items-center text-[#755216] font-bold text-xl focus:border-0"
        >
          <VscDebugRestart />
        </button>
      </div>
    </div>
  );
};

export default Playground;

const Bottom = ({ winner, player1, sender }) => {
  // console.log(`Player1 : ${player1} ---- Sender : ${sender}`);
  if (player1)
    return (
      <>
        {winner ? (
          winner !== "draw" ? (
            <div
              className={`bg-gradient-to-b ${
                sender
                  ? "from-[#54f985a6] to-[#15f363]"
                  : "from-[#f95454a6] to-[#f3151599]"
              } rounded-2xl text-slate-900 py-3 px-5 font-bold text-center `}
            >
              <p>{sender ? "You" : "Opponent"} Won</p>
            </div>
          ) : (
            <div className="bg-gradient-to-b from-[#54dbf9] to-[#1badf6] rounded-2xl text-slate-900 py-3 px-5 font-bold text-center ">
              <p className="">Match Draw</p>
            </div>
          )
        ) : (
          <div
            className="bg-gradient-to-b from-[#f9d154] to-[#f6a71b] rounded-2xl text-slate-900 py-3 px-5 font-bold text-center "
            style={{ opacity: sender ? 1 : 0.5 }}
          >
            <p>{sender ? "Your" : "Opponent"} Turn</p>
          </div>
        )}
      </>
    );
  return (
    <>
      {winner ? (
        winner !== "draw" ? (
          <div
            className={`bg-gradient-to-b ${
              !sender
                ? "from-[#54f985a6] to-[#15f363]"
                : "from-[#f95454a6] to-[#f31515]"
            } rounded-2xl text-slate-900 py-3 px-5 font-bold text-center `}
          >
            <p>{!sender ? "You" : "Opponent"} Won</p>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-[#54dbf9] to-[#1badf6] rounded-2xl text-slate-900 py-3 px-5 font-bold text-center ">
            <p className="">Match Draw</p>
          </div>
        )
      ) : (
        <div
          className="bg-gradient-to-b from-[#f9d154] to-[#f6a71b] rounded-2xl text-slate-900 py-3 px-5 font-bold text-center "
          style={{ opacity: !sender ? 1 : 0.5 }}
        >
          <p>{!sender ? "Your" : "Opponent"} Turn</p>
        </div>
      )}
    </>
  );
};
