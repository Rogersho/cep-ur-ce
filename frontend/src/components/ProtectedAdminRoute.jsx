import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    // If not logged in at all, redirect to login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Only admins can access the admin section
    if (user.role !== 'admin') {
        return <Navigate to="/my-uploads" replace />;
    }

    return <Outlet />;
};

export default ProtectedAdminRoute;
