import { Navigate } from "react-router-dom";
import {useAuth} from "../../hooks/UseAuth.tsx";
import type {JSX} from "react";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return children;
};