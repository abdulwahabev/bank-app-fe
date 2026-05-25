import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuth, user, handleLogout } = useAuth();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        /* z-[1000] ko badal kar standard z-50 kar diya hai */
        <nav className="bg-white border-b border-slate-100 py-4 sticky top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    
                    {/* 1. Logo Section */}
                    <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">D</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900">
                            Digital<span className="text-blue-600">Bank</span>
                        </span>
                    </Link>

                    {/* 2. Desktop Links */}
                    <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
                        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                        {!isAuth && <Link to="/security" className="hover:text-blue-600 transition-colors">Security</Link>}
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

                    {/* 3. Desktop Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuth ? (
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-slate-900">Hi, {user?.fullName?.split(' ')[0]}</span>
                                    <span className="text-[10px] text-blue-600 font-medium uppercase tracking-wider">Verified User</span>
                                </div>
                                <button onClick={handleLogout} className="bg-slate-100 text-slate-700 px-5 py-2 rounded-full font-semibold hover:bg-red-50 hover:text-red-600 transition-all">Logout</button>
                            </div>
                        ) : (
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
                        <button onClick={toggleMenu} className="text-slate-600 p-2 text-xl focus:outline-none">
                            {isOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </div>

                {/* 5. Mobile Navigation Menu */}
                {isOpen && (
                    /* z-[999] ko badal kar standard z-40 kar diya hai taake koi error na aaye */
                    <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 p-6 shadow-xl z-40">
                        <div className="flex flex-col gap-4 text-slate-600 font-medium">
                            
                            <Link to="/" className="hover:text-blue-600 py-1" onClick={closeMenu}>Home</Link>
                            
                            {!isAuth && (
                                <Link to="/security" className="hover:text-blue-600 py-1" onClick={closeMenu}>Security</Link>
                            )}
                            
                            {isAuth && (
                                <Link
                                    to={user?.role === 'admin' ? "/admin" : "/dashboard"}
                                    onClick={closeMenu}
                                    className="hover:text-blue-600 py-1"
                                >
                                    Dashboard
                                </Link>
                            )}
                            
                            <Link to="/features" className="hover:text-blue-600 py-1" onClick={closeMenu}>Features</Link>

                            <hr className="border-slate-100 my-2" />

                            {isAuth ? (
                                <div className="flex flex-col gap-3">
                                    <div className="px-2">
                                        <p className="text-xs text-slate-400 font-normal">Logged in as</p>
                                        <span className="font-bold text-slate-900">{user?.fullName}</span>
                                    </div>
                                    <button 
                                        onClick={() => { handleLogout(); closeMenu(); }} 
                                        className="text-center py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 pt-2">
                                    <Link to="/auth/login" className="text-center py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50" onClick={closeMenu}>
                                        Log In
                                    </Link>
                                    <Link to="/auth/register" className="text-center py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors" onClick={closeMenu}>
                                        Open Account
                                    </Link>
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