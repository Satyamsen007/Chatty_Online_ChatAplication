import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
    const { authUser, logout } = useAuthStore();
    const location = useLocation()
    return (
        <header className="border-b border-base-300 sticky w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    <Link to={'/'} className={`flex items-center ${(authUser && location.pathname === '/') && "max-sm:pl-14"} gap-2.5 hover:opacity-80 transition-all`}>
                        <div className="size-9 max-md:size-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 max-md:w-4 max-md:h-4 text-primary" />
                        </div>
                        <h1 className="text-lg max-md:text-base font-bold">Chatty</h1>
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link to={'/settings'} className={`btn btn-sm gap-2 rounded-md transition-colors`}>
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </Link>

                        {
                            authUser && (
                                <>
                                    <Link to={'/profile'} className={`btn rounded-md btn-sm gap-2 transition-colors`}>
                                        <User className="size-5 max-md:size-4" />
                                        <span className="hidden sm:inline">Profile</span>
                                    </Link>
                                    <button className="flex gap-2 items-center cursor-pointer" onClick={logout}>
                                        <LogOut className="size-5 max-md:size-4" />
                                        <span className="hidden text-xs sm:inline">Logout</span>
                                    </button>
                                </>
                            )
                        }
                    </div>
                </div>

            </div>
        </header>
    );
};

export default Navbar;
