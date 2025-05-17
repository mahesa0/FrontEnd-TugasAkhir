import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  isAuthenticated: boolean;
}

const ProtectedRoute = ({ children, isAuthenticated }: ProtectedRouteProps) => {
  const location = useLocation();
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        state={{
          from: location,
          message: "Silahkan masuk terlebih dahulu",
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
