import { useEffect, useState } from "react";

const Board = ({ board, handleTick, winner, sender, player1 }) => {
  return (
    <div className="w-3/4 bg-white aspect-square p-1 mx-auto border-2 border-dashed border-[#f22853] rounded-2xl">
      <div
        className="mx-auto divide-y divide-white divide-dashed w-full h-full rounded-2xl bg-[#f22853] p-2"
        //   style={{
        //     backgroundColor: "white",
        //     color: "black",
        //     borderWidth: 3,
        //     borderColor: "red",
        //   }}
      >
        {board?.map((r, idr) => (
          <div
            className=" divide-x divide-white divide-dashed h-1/3 flex"
            key={idr}
          >
            {r?.map((cell, idcell) => (
              <button
                className="focus:ring-0 focus:border-0 focus:outline-none bg-transparent outline-none border-0 ring-0 p-0 w-1/3 justify-center items-center flex disabled:cursor-not-allowed "
                key={idr + idcell}
                disabled={sender !== player1 || !(cell === 0 && !winner)}
                onClick={() => handleTick(idr, idcell)}
                // style={{
                //   cursor: cell === 0 && !winner ? "pointer" : "not-allowed",
                // }}
              >
                {cell === 0 ? <></> : cell == 1 ? <Cross /> : <Round />}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;

export const Round = () => {
  return (
    <div className="rounded-full w-2/5 aspect-square flex justify-center items-center bg-[#fde8ed] shadow-2xl">
      <div className="rounded-full w-1/2 aspect-square bg-[#f22853]"></div>
    </div>
  );
};

export const Cross = () => {
  return (
    <div className="w-1/2 h-[14%] relative -top-[1%] -right-[1%]">
      <div className="absolute h-full shadow-2xl w-full rounded-full rotate-45 bg-[#fad459]"></div>
      <div className="absolute h-full shadow-2xl w-full -rotate-45 rounded-full  bg-[#fad459]"></div>
    </div>
  );
};
