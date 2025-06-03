import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function ProtectedRout({ children }) {
  const { isauth } = useAuth();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!isauth) navigate("/");
    },
    [isauth, navigate]
  );

  return isauth ? children : null;
}

export default ProtectedRout;
