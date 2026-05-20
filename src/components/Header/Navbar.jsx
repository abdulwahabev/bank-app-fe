import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Context import karein

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuth, user, handleLogout } = useAuth(); // Auth states nikaalein

    const toggleMenu = () => setIsOpen(!isOpen);

    return (

        <nav className="bg-white border-b border-slate-100 py-4 sticky top-0 z-[1000] w-full">

            <div className="max-w-7xl mx-auto px-6">

                <div className="flex justify-between items-center h-16">

                    {/* 1. Logo Section */}
                    <Link to="/" className="flex items-center gap-2 z-[1001]" onClick={() => setIsOpen(false)}>
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <Link to="/"><span className="text-white font-bold text-xl">D</span></Link>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900">
                            <Link to="/">Digital<span className="text-blue-600">Bank</span></Link>
                        </span>
                    </Link>

                    {/* 2. Desktop Links */}
                    <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
                        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>

                        {/* Hide Security if logged in */}
                        {!isAuth && <Link to="/security" className="hover:text-blue-600 transition-colors">Security</Link>}

                        {/* Show Dashboard if logged in */}
                        {isAuth && (
                            <Link
                                to={user?.role === 'admin' ? "/admin" : "/dashboard"}
                                className="hover:text-blue-600 transition-colors"
                            >
                                Dashboard
                            </Link>
                        )}

                        <Link to="/features" className="hover:text-blue-600 transition-colors">Features</Link>
                    </div>

                    {/* 3. Desktop Buttons (Right Side - Conditional) */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuth ? (
                            // Agar User Login Hai
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-slate-900">Hi, {user?.fullName?.split(' ')[0]}</span>
                                    <span className="text-[10px] text-blue-600 font-medium uppercase tracking-wider">Verified User</span>
                                </div>
                                <button onClick={handleLogout} className="bg-slate-100 text-slate-700 px-5 py-2 rounded-full font-semibold hover:bg-red-50 hover:text-red-600 transition-all">Logout</button>
                            </div>
                        ) : (
                            // Agar User Login Nahi Hai
                            <>
                                <Link to="/auth/login" className="text-slate-700 font-semibold hover:text-blue-600 px-4">
                                    Log In
                                </Link>
                                <Link to="/auth/register" className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl font-medium hover:bg-blue-700 transition-all">
                                    Open Account
                                </Link>
                            </>
                        )}
                    </div>

                    {/* 4. Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-slate-600 p-2">
                            {isOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </div>

                {/* 5. Mobile Navigation Menu */}
                {isOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white border-t p-6 shadow-xl">
                        <div className="flex flex-col gap-4">
                            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                            {isAuth && (
                                <Link
                                    to={user?.role === 'admin' ? "/admin" : "/dashboard"}
                                    onClick={() => setIsOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            )}

                            <hr className="border-slate-100" />

                            {isAuth ? (
                                <>
                                    <span className="font-bold text-slate-900 px-2">Account: {user?.fullName}</span>
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-left py-3 px-2 text-red-600 font-bold">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link to="/auth/login" className="text-center py-3 border rounded-xl font-bold" onClick={() => setIsOpen(false)}>Log In</Link>
                                    <Link to="/auth/register" className="text-center py-3 bg-blue-600 text-white rounded-xl font-bold" onClick={() => setIsOpen(false)}>Open Account</Link>
                                </div>
                            )}
                        </div>
                    </div>

                )}
            </div>

        </nav>

    );
};

export default Navbar;
