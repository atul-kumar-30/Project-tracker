import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from './AppLayout';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = () => {
    const { token, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return token ? (
        <AppLayout>
            <Outlet />
        </AppLayout>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default ProtectedRoute;
