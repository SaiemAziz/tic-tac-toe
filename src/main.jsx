import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./functions/routes";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();
const { innerWidth: width, innerHeight: height } = window;
console.log(width, height);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div
      className="flex justify-center items-center bg-[#fad459]"
      style={{ width, height, overflow: "hidden" }}
    >
      <div
        className={`h-full ${
          width / height > 3 / 4 ? "aspect-[1080/1920]" : "w-full"
        } bg-white`}
      >
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={routes} />
        </QueryClientProvider>
      </div>
    </div>
  </React.StrictMode>
);
