import React, { useEffect, useState } from 'react';

const messages = [
  "Initializing server...",
  "Fetching resources...",
  "Loading dependencies...",
  "Configuring settings...",
  "Preparing environment...",
  "Almost ready, please wait...",
  "Running final checks...",
  "Finalizing startup..."
];

const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000); // Change message every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%),
                           radial-gradient(circle at 75% 25%, #06b6d4 0%, transparent 50%),
                           radial-gradient(circle at 25% 75%, #6366f1 0%, transparent 50%)`,
          backgroundSize: '800px 800px',
          animation: 'float 20s ease-in-out infinite'
        }}></div>
      </div>
      
      {/* Elegant Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/8 to-purple-600/8 rounded-full filter blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-3/4 w-80 h-80 bg-gradient-to-br from-cyan-500/6 to-blue-600/6 rounded-full filter blur-3xl animate-float animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        {/* Brand Logo */}
        <div className="mb-8">
          <div className="text-4xl font-bold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Connect</span>
            <span className="text-white">API</span>
          </div>
        </div>
        
        {/* Enhanced Spinning Loader */}
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-pink-500 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
          <div className="absolute inset-2 w-16 h-16 border-2 border-blue-400 border-l-transparent rounded-full animate-spin animation-delay-300" style={{ animationDirection: 'reverse' }}></div>
        </div>
        
        {/* Loading Message */}
        <p className="text-xl font-medium text-gray-300 animate-pulse">{messages[messageIndex]}</p>
        
        {/* Progress Dots */}
        <div className="flex space-x-2 mt-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce`}
              style={{ animationDelay: `${i * 200}ms` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;
