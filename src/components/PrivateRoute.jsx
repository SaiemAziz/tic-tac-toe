import { useContext } from "react";
import { AuthContext } from "./authProvider";
import { Navigate } from "react-router-dom";
import { Button, Spinner } from "keep-react";
const PrivateRoute = ({ children }) => {
  const { user, userLoading } = useContext(AuthContext);
  if (userLoading)
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
  else if (!user) return <Navigate to="/login" />;
  else return children;
};

export default PrivateRoute;
