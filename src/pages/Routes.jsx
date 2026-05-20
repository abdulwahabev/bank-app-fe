import { Routes, Route, Navigate } from "react-router-dom"
import Frontend from "@/pages/Frontend/index"
import Auth from "@/pages/Auth/index"
import Dashboard from "@/pages/Dashboard/index"
import AdminDashboard from "@/pages/AdminDashboard/index"
import Application from "@/pages/User/Application";
import Pending from "@/pages/User/pending";
import { useAuth } from "@/context/AuthContext"
import ProtectRoute from "@/components/ProtectRoute"

const Index = () => {
    const { isAuth, user } = useAuth();

    return (
        <Routes>
            <Route path="/*" element={<Frontend />} />

            {/* Auth Routes */}
            <Route path="/auth/*" element={
                !isAuth ? <Auth /> :
                    (user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />)
            } />

            {/* User Dashboard Logic with Status Check */}
            <Route path="/dashboard/*" element={
                <ProtectRoute allowRoles={['user']}>
                    {/* Status ke mutabiq component decide hoga */}
                    {user?.status === 'incomplete' ? <Navigate to="/application" replace /> :
                        user?.status === 'pending' ? <Navigate to="/pending-approval" replace /> :
                            <Dashboard />}
                </ProtectRoute>
            } />

            {/* Alag se routes status ke liye */}
            <Route path="/application" element={<ProtectRoute allowRoles={['user']} Component={Application} />} />
            <Route path="/pending-approval" element={<ProtectRoute allowRoles={['user']} Component={Pending} />} />

            {/* Admin Dashboard */}
            <Route path="/admin/*" element={<ProtectRoute allowRoles={['admin']} Component={AdminDashboard} />} />
        </Routes>
    );
}

export default Index    