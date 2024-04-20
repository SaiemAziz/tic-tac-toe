import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../App";
import AuthProvider from "../components/authProvider";
import Login from "../pages/login";
import PrivateRoute from "../components/PrivateRoute";
import Playground from "../pages/playground";
import PlayersList from "../pages/playersList";
import Profile from "../pages/profile";

export const routes = createBrowserRouter([
  {
    path: "/",
    errorElement: <p>error</p>,
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      // {
      //   path: "/",
      //   element: (
      //     <PrivateRoute>
      //       <Navigate to="/players" />
      //     </PrivateRoute>
      //   ),
      // },
      {
        index: true,
        element: (
          <PrivateRoute>
            <Navigate to="/players" />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/players",
        element: (
          <PrivateRoute>
            <PlayersList />
          </PrivateRoute>
        ),
      },
      {
        path: "/playground",
        element: (
          <PrivateRoute>
            <Playground />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
