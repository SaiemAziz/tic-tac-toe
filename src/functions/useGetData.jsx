import React from "react";
import { useQuery } from "@tanstack/react-query";

// export const backendURL = import.meta.env.VITE_BACKEND_PROD;
export const backendURL = import.meta.env.VITE_BACKEND_PROD_RENDER;
// export const backendURL = import.meta.env.VITE_BACKEND_DEV;
const useGetData = (url) => {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: [url],
    queryFn: () => fetch(backendURL + url).then((res) => res.json()),
  });
  return { isPending, error, data, refetch };
};

export default useGetData;
