import { Navigate } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useauth';
const PrivateRoute = ({ children, allowedRoles }) => {
  const { currentUser, role } = useAuth();

  if (!currentUser) {
    // If user is not logged in, redirect to login
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    // If user does not have the appropriate role, redirect to an error page or home
    return <Navigate to="/" />;
  }

  // If user is logged in and has the appropriate role, render the children components
  return children;
};

export default PrivateRoute;
