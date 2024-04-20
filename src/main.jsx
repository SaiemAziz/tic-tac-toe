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
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <div className="w-screen flex justify-center items-center bg-[#fad459]">
    <div className="h-screen aspect-[1080/1920] bg-white">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes} />
      </QueryClientProvider>
    </div>
  </div>
  // </React.StrictMode>
);
