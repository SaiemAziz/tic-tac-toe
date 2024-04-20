import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Board from "./components/board";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default App;
