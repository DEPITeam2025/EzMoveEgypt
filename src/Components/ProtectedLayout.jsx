import React from "react";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};

export default ProtectedLayout;
