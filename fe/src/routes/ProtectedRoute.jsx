import React from "react";
import { Navigate, Route } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const userId = localStorage.getItem("user_id");
  const isInQueue = localStorage.getItem("in_queue") === "true";

  return isInQueue ? <Component /> : <Navigate to="/student/confirm-change-schedule" />;
};

export default ProtectedRoute;
