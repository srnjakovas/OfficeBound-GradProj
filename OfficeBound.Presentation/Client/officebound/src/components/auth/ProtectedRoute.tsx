import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Role, hasPermission } from '../../utils/roles';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: Role[];
    requireAuth?: boolean;
}

export default function ProtectedRoute({ 
    children, 
    requiredRoles, 
    requireAuth = true 
}: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuth();

    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRoles && user) {
        if (!hasPermission(user.role, requiredRoles)) {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
}

