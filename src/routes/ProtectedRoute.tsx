import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useAuthStore } from "../store/auth-store";
import { getDefaultRouteByRole, hasPathAccess } from "../utils/permission";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { accessToken, user, viewMode } = useAuthStore((state) => state);
  const hasAccess = hasPathAccess(user.role, location.pathname);
  
  // check accessToken and path access
  if(accessToken && hasAccess){
    return <>{children}</>;
  } else if(accessToken && !hasAccess){
    const pathName = getDefaultRouteByRole(user?.role, viewMode);
    return <Navigate to={pathName} replace />;
  }
  else return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
