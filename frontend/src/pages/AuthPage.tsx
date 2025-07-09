import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Loader from "../pages/loader";

const AuthPage: React.FC = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [role, setRole] = useState("user");
  const [name, setName] = useState(""); // Name field for signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  // Auth guard - redirect if already logged in
  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    const adminToken = localStorage.getItem("adminToken");
    
    if (userToken) {
      navigate("/user", { replace: true });
      return;
    }
    
    if (adminToken) {
      navigate("/admin", { replace: true });
      return;
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Determine endpoint based on signup/login and role
    let endpoint = "";
    if (isSignup) {
      endpoint = role === "admin" ? "/admin/signup" : "/user/signup";
    } else {
      endpoint = role === "admin" ? "/admin/login" : "/user/login";
    }
    
    // For signup, include name; for login, send only email and password.
    const payload = isSignup ? { name, email, password } : { email, password };
    
    // Show loader when request is made
    setIsLoading(true);
    
    try {
      const res = await axiosClient.post(endpoint, payload);
      const token = res.data.token;
      
      // Store the token under a role-specific key and navigate accordingly
      if (role === "admin") {
        localStorage.setItem("adminToken", token);
        navigate("/admin", { replace: true });
      } else {
        localStorage.setItem("userToken", token);
        navigate("/user", { replace: true });
      }
    } catch (err: any) {
      console.error("Error from backend:", err.response?.data);
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Render loader while waiting for backend response
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 text-white relative overflow-hidden">
      {/* Elegant Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/8 to-purple-600/8 rounded-full filter blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-3/4 w-80 h-80 bg-gradient-to-br from-cyan-500/6 to-blue-600/6 rounded-full filter blur-3xl animate-float animation-delay-4000"></div>
      </div>
      
      {/* Glassmorphism Card */}
      <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[400px] border border-white/10">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6">
          {isSignup ? "Create an Account" : "Welcome Back"}
        </h2>

        {/* Role Toggle Slider */}
        <div className="relative w-full flex items-center justify-center mb-6">
          <div className="bg-gray-600 w-full flex rounded-full p-1 relative">
            <span
              className={`absolute left-0 top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-blue-600 to-gray-400 transition-all duration-300 ${
                role === "admin" ? "translate-x-full" : "translate-x-0"
              }`}
            ></span>
            <button
              className={`w-1/2 py-2 text-lg font-semibold relative z-10 transition ${
                role === "user" ? "text-white" : "text-gray-300"
              }`}
              onClick={() => setRole("user")}
            >
              User
            </button>
            <button
              className={`w-1/2 py-2 text-lg font-semibold relative z-10 transition ${
                role === "admin" ? "text-white" : "text-gray-300"
              }`}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field appears only during signup */}
          {isSignup && (
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-md focus:ring-2 focus:ring-purple-200 focus:outline-none"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-md focus:ring-2 focus:ring-purple-200 focus:outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-md focus:ring-2 focus:ring-purple-200 focus:outline-none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.415 1.415M14.12 14.12L9.878 9.878" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {isSignup && (
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-md focus:ring-2 focus:ring-purple-200 focus:outline-none"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M14.12 14.12l1.415 1.415M14.12 14.12L9.878 9.878" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            {isSignup
              ? `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}`
              : `Log In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        {error && (
          <p className="text-center text-red-500 mt-4">
            {error}
          </p>
        )}

        {/* Toggle between Signup/Login */}
        <p className="text-center text-gray-200 mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="text-purple-400 font-semibold hover:underline"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </p>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link to="/" className="text-purple-300 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
