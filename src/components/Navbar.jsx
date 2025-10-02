import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoSrc from "../assets/logo.png";
import {
  HomeIcon,
  BookOpenIcon,
  TrophyIcon,
  ChatBubbleLeftEllipsisIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon, // Added for the Admin link
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Modules", path: "/modules", icon: BookOpenIcon },
    { name: "Achievements", path: "/achievements", icon: TrophyIcon },
    { name: "Community", path: "/community-chat", icon: ChatBubbleLeftEllipsisIcon },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-b dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <img src={logoSrc} alt="Home" className="h-12 w-auto" />
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.name} to={item.path} className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${isActive ? "bg-purple-100 text-purple-700 dark:bg-slate-700 dark:text-white" : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}>
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* --- THIS IS THE NEW LOGIC --- */}
            {isAuthenticated && user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-lg text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-slate-800 transition-colors font-medium">
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}
            {/* --------------------------- */}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <UserIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium text-slate-900 dark:text-slate-200">{user.name}</span>
                </div>
                <button onClick={logout} className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
                Login
              </Link>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* You can add the admin link to the mobile menu here as well */}
        {isOpen && (
          <div className="md:hidden py-4">
            {/* Mobile menu content */}
          </div>
        )}
      </div>
    </nav>
  );
}