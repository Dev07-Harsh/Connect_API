

const LearnMorePage = () => {
  return (
    <div className="bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white relative overflow-hidden">
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
  
      <nav className="w-full flex justify-between items-center p-6 fixed top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="text-3xl font-bold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Connect</span>
          <span className="text-white">API</span>
        </div>
      </nav>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
      <div className="max-w-4xl mt-24 px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Learn More About ConnectAPI
          </span>
        </h1>
        <p className="text-lg text-gray-200 mb-8 text-center">
          ConnectAPI simplifies API discovery and integration by connecting API providers and consumers through intelligent, AI-powered recommendations.
        </p>
        <div className="space-y-8">
          <section>
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400">Our Motive</h2>
            <p className="text-lg text-gray-200">
              Our primary motive is to streamline the process of finding and integrating APIs, reducing complexity and empowering developers and businesses to innovate faster. We bridge the gap between API providers and consumers, making technology more accessible and easier to use.
            </p>
          </section>
          <section>
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400">Advantages</h2>
            <ul className="list-disc list-inside text-lg text-gray-200">
              <li>AI-powered recommendations for personalized API discovery.</li>
              <li>Intuitive, modern user interface for a seamless experience.</li>
              <li>Secure and efficient integration between API providers and consumers.</li>
              <li>Robust analytics and management tools to track API performance.</li>
              <li>Scalable architecture built with modern technologies for future growth.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400">Why Choose ConnectAPI?</h2>
            <p className="text-lg text-gray-200">
              With ConnectAPI, you save time and avoid the hassle of navigating through countless API options. Our platform delivers data-driven insights, allowing you to make informed decisions and integrate APIs effortlessly—whether you're building a new application or enhancing an existing one.
            </p>
          </section>
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default LearnMorePage;
