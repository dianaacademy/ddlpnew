import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../../auth/hooks/useauth';

const AuthenticatedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login page and save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default AuthenticatedRoute;