import { useAuth } from "@/context/AuthContext"
import { Navigate, useLocation } from 'react-router-dom'

const ProtectRoute = ({ children, Component, allowRoles }) => {

    const { isAuth, user, isAppLoading } = useAuth();
    const location = useLocation();

    if (isAppLoading) { return <div className="h-screen flex items-center justify-center">Loading...</div> }

    if (!isAuth) { return <Navigate to="/auth/login" replace /> }

    if (allowRoles && !allowRoles.includes(user?.role)) { return <Navigate to="/" replace /> }

    // Status logic: User ko sahi page par dhakelnay ke liye
    if (user?.role === 'user') {

        if (user?.status === 'incomplete' && location.pathname !== '/application') { return <Navigate to="/application" replace /> }

        if (user?.status === 'pending' && location.pathname !== '/pending-approval') { return <Navigate to="/pending-approval" replace /> }

        // Agar status pending ya incomplete hai aur user dashboard pe janay ki koshish kare
        if (user?.status !== 'active' && location.pathname.startsWith('/dashboard')) {

            if (user?.status === 'incomplete') return <Navigate to="/application" replace />

            if (user?.status === 'pending') return <Navigate to="/pending-approval" replace />
        }
    }

    // FINAL RENDER CHECK:
    // 1. Agar Component prop hai (like in Admin) toh use render karo
    if (Component) return <Component />;

    // 2. Agar Dashboard wrapper hai toh children (Dashboard) render karo
    return children;
}

export default ProtectRoute;