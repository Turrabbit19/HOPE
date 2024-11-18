// src/context/authContext.js
import React from "react";

export const AuthContext = React.createContext({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
});
