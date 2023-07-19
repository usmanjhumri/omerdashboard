import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../../../contexts/Context";

const UserPrivateRoutes = () => {
  const { authenticated, isAdmin } = useUserContext();

  return authenticated && !isAdmin ? <Outlet /> : <Navigate to={"/login"} />;
};

export default UserPrivateRoutes;
