import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

interface AdminToken {
  id: string;
  role: string;
  name: string;
}

const AdminHomePage: React.FC = () => {
  const [adminName, setAdminName] = useState("Admin");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const decoded = jwtDecode<AdminToken>(token);
        if (decoded?.name) {
          setAdminName(decoded.name);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-10">
      <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400">
          Welcome,
        </span>
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          {adminName}!
        </span>
      </h1>
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-2 sm:px-4">
        {/* Card 1: List New API */}
        <div className="group p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-purple-400/50 transition-all duration-500">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-white text-center">List New API</h2>
          <p className="text-gray-300 text-center mb-6 leading-relaxed">
            Create a new API listing by providing all the necessary details.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/admin/create-api")}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 border border-white/20 relative overflow-hidden"
            >
              <span className="relative z-10">Create API</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>
        </div>
        {/* Card 2: My APIs */}
        <div className="group p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-purple-400/50 transition-all duration-500">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-white text-center">My APIs</h2>
          <p className="text-gray-300 text-center mb-6 leading-relaxed">
            View and manage your previously listed APIs.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/admin/my-apis")}
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-white/20 border border-white/20 backdrop-blur-sm"
            >
              View APIs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
