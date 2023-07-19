import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "../../../contexts/Context";

const UserPublicRoutes = () => {
  const { authenticated, isAdmin } = useUserContext();

  return authenticated ? (
    isAdmin ? (
      <Navigate to={"/dashboard/a"} />
    ) : (
      <Navigate to={"/dashboard/u"} />
    )
  ) : (
    <Outlet />
  );
};

export default UserPublicRoutes;
