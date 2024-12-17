import React from "react";
import { Navigate, Route } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const userId = localStorage.getItem("user_id");
  const role = localStorage.getItem("role") === "Sinh viên";

  return isInQueue ? <Component /> : <Navigate to="/student/confirm-change-schedule" />;
};

export default ProtectedRoute;
