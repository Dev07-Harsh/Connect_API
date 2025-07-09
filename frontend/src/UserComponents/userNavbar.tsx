import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

interface UserToken {
  id: string;
  role: string;
  name: string;
}

const UserNavbar: React.FC = () => {
  const [userName, setUserName] = useState("User");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const decoded = jwtDecode<UserToken>(token);
        if (decoded?.name) {
          setUserName(decoded.name);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login", { replace: true });
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: "Home",
      path: "/user",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      )
    },
    {
      name: "Bookmarks",
      path: "/user/bookmarks",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )
    },
    {
      name: "History",
      path: "/user/history",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ];

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 fixed top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-white/10">
      {/* Logo */}
      <div 
        className="text-2xl font-bold tracking-tight cursor-pointer"
        onClick={() => navigate('/user')}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Connect</span>
        <span className="text-white">API</span>
      </div>

      {/* Navigation Items */}
      <div className="hidden md:flex items-center space-x-1 bg-white/5 rounded-full p-2 backdrop-blur-sm border border-white/10">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300
              ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }
            `}
          >
            {item.icon}
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
      </div>

      {/* User Profile */}
      <div className="relative">
        <button
          onClick={() => setDropdownVisible(!dropdownVisible)}
          className="flex items-center space-x-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block text-white font-medium">{userName}</span>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${dropdownVisible ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {dropdownVisible && (
          <div className="absolute right-0 mt-2 w-56 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            {/* User Info */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white">{userName}</p>
                  <p className="text-xs text-gray-400">API Explorer</p>
                </div>
              </div>
            </div>
            
            {/* Mobile Navigation (only visible on mobile) */}
            <div className="md:hidden border-b border-white/10">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setDropdownVisible(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors
                    ${
                      isActive(item.path)
                        ? "bg-purple-500/20 text-purple-300 border-r-2 border-purple-400"
                        : "text-gray-300 hover:bg-white/5"
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-4 text-left text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;
