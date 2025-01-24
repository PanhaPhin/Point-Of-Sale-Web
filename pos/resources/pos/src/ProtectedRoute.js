import React from "react";
import {Tokens} from "./constants";
import {Navigate} from "react-router-dom";

const  ProtectedRoute = (props) => {
    const {component} = props
    const token = localStorage.getItem(Tokens.ADMIN)
    if (!token) {
        return <Navigate to='/login' replace={true} />;
    }
    return  component;
};

export default ProtectedRoute;
