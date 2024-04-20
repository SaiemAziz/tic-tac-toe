import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { createContext, useEffect, useMemo, useState } from "react";
import auth from "../functions/firebase,config.";
import { io } from "socket.io-client";
import { backendURL } from "../functions/useGetData";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  // const socket = useMemo(() => user && io(backendURL, { query: user }), [user]);
  const provider = new GoogleAuthProvider();
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const uid = currentUser.uid;
        if (uid) {
          fetch(backendURL + "/users/single-user?email=" + currentUser?.email)
            .then((r) => r.json())
            .then((data) => {
              setUserLoading(false);
              setUser(data?.data);
              console.log(data);
            })
            .catch((err) => {
              setUserLoading(false);
              setUser(null);
            });
        }
      } else {
        setUserLoading(false);
        setUser(null);
      }
    });
  }, []);

  // console.log(socket);
  // console.log(socket?.connected);
  useEffect(() => {
    if (!socket) return;
    socket?.on("connect", () => {
      console.log(user?.email, socket?.id);
      // alert("Connected");
    });

    socket.on("status", (m) => {
      console.log(m);
    });

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
    socket?.on("accept-invitation", (m) => {
      if (user?.email !== m?.sender) return;
      socket?.emit("both-accepted", m);
    });

    socket?.on("start-game", (m) => {
      navigate(`/playground`, { state: m });
    });
    return () => {
      if (socket) {
        socket?.close();
      }
    };
  }, [socket]);

  useEffect(() => {
    if (user) {
      const tempSocket = io(backendURL, { query: user, autoConnect: true });
      setSocket(tempSocket);
      return () => {
        socket?.close();
      };
    } else {
      if (socket) {
        socket?.close();
        setSocket(null);
      }
    }
  }, [user]);

  const googleLogin = () => {
    setUserLoading(true);
    return signInWithPopup(auth, provider);
  };
  const logOut = () => {
    setUserLoading(true);
    return signOut(auth);
  };

  const value = {
    user,
    logOut,
    userLoading,
    setUserLoading,
    setUser,
    googleLogin,
    socket,
    setSocket,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
