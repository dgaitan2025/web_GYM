import { Navigate } from "react-router-dom";
import {decryptString} from "./Encriptar"

export function PrivateRoute({ children }) {
  const valor = decryptString(localStorage.getItem("isLogged"));
  console.log(valor);
  const isLogged = valor === "true";

  return isLogged ? children : <Navigate to="/" replace />;
}

export function RequireRole({ roles, children }) {

  
  const userRole = Number(decryptString(localStorage.getItem("tipoUser")));
  
  if (!roles.includes(userRole)) {
    return <Navigate to="/sitedinamic/" replace />;
  }
  return children;
}