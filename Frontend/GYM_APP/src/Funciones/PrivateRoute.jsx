import { Navigate } from "react-router-dom";

export function PrivateRoute({ children }) {
  const isLogged = localStorage.getItem("isLogged") === "true";

  return isLogged ? children : <Navigate to="/" replace />;
}

export function RequireRole({ roles, children }) {
  const userRole = Number(localStorage.getItem("tipoUser"));
  if (!roles.includes(userRole)) {
    return <Navigate to="/sitedinamic/" replace />;
  }
  return children;
}