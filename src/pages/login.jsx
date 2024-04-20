import React, { useContext } from "react";
import { AuthContext } from "../components/authProvider";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Cross, Round } from "../components/board";
import { backendURL } from "../functions/useGetData";
import PageTitle from "../components/pageTitle";
const Login = () => {
  console.log(backendURL);
  const { setUser, setUserLoading, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogin = () => {
    googleLogin()
      .then((r) => {
        fetch(backendURL + "/users/insert-user", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            displayName: r?.user?.displayName,
            photoURL: r?.user?.photoURL,
            email: r?.user?.email,
          }),
        })
          .then((r) => r.json())
          .then((d) => {
            setUser({
              displayName: r?.user?.displayName,
              photoURL: r?.user?.photoURL,
              email: r?.user?.email,
            });
            setUserLoading(false);
            navigate("/players");
          });
      })
      .catch((err) => {
        setUser(null);
        setUserLoading(false);
      });
  };
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#f32853]">
      <PageTitle>Login</PageTitle>
      <div className="flex justify-between items-center w-1/2">
        <p className="text-4xl mb-2 relative font-bold text-slate-900 ">TIC</p>
        <div className="w-20 relative -top-10 flex justify-end scale-[2]">
          <Round />
        </div>
      </div>
      <p className="text-6xl mb-2 relative font-bold text-[#fad459]">TAC</p>
      <div className="flex justify-between items-center w-1/2">
        <div className="w-20 aspect-square flex justify-start relative -bottom-20 scale-[2]">
          <Cross />
        </div>
        <p className="text-4xl mb-2 relative font-bold text-slate-900">TOE</p>
      </div>
      <button
        onClick={handleLogin}
        className="bg-[#fee8ed] text-[#f32853] text-xl justify-center rounded-2xl p-2 px-4 focus:ring-0 focus:outline-none focus:border-0 mt-28"
      >
        <p className="flex items-center">
          <FcGoogle size={30} className="mr-5" /> Login with Google
        </p>
      </button>
    </div>
  );
};

export default Login;
