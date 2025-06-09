import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/login") {
      navigate("/login");
    }
  }, [location, navigate]);

  return (
    <p>
      Seems you're not authorized to access this page. Please login and try again.
    </p>
  );
};

export default NotFound;
