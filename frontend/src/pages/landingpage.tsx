import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in and redirect them
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
    
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [navigate]);

  return (
    <div className="bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white relative">
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
      
      {/* Subtle Mouse Follower */}
      <div 
        className="fixed w-4 h-4 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full filter blur-sm pointer-events-none transition-all duration-500 ease-out z-50"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
      ></div>

      {/* Fixed Navbar */}
      <nav className="w-full flex justify-between items-center p-6 fixed top-0 z-50 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="text-3xl font-bold tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Connect</span>
          <span className="text-white">API</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/signup">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 border border-white/20">
              Sign Up
            </button>
          </Link>
          <Link to="/login">
            <button className="px-6 py-3 bg-white/10 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-white/20 border border-white/20 backdrop-blur-sm">
              Log In
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
        <div className={`text-center max-w-5xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Hero Badge */}
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm mt-40">
            <span className="text-sm font-medium text-purple-200">✨ AI-Powered API Discovery Platform</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400">
              Discover APIs
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Effortlessly
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your one-stop platform to explore, search, and integrate APIs with 
            <span className="text-purple-400 font-semibold"> AI-powered recommendations</span>. 
            Perfect for developers and businesses alike.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/signup">
              <button className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 border border-white/20 relative overflow-hidden">
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </Link>
            <Link to="/learn-more">
              <button className="group px-8 py-4 bg-white/10 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-white/20 border border-white/20 backdrop-blur-sm relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Learn More
                  <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
          
          {/* Scroll Indicator */}
          <div className="mt-16 flex flex-col items-center">
            <span className="text-gray-400 text-sm mb-2">Discover More</span>
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Why Choose ConnectAPI?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built for developers, designed for efficiency. Experience the future of API discovery.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-purple-400/50 transition-all duration-500">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🔍</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Smart Search</h3>
              <p className="text-gray-300 leading-relaxed">
                Our AI-powered search engine understands context and finds exactly what you need. 
                Search by functionality, not just keywords.
              </p>
            </div>
            
            <div className="group p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-purple-400/50 transition-all duration-500">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">⚡</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Lightning Fast</h3>
              <p className="text-gray-300 leading-relaxed">
                Get up and running in minutes with our comprehensive documentation, 
                code examples, and one-click integration guides.
              </p>
            </div>
            
            <div className="group p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-purple-400/50 transition-all duration-500">
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">🚀</div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Developer First</h3>
              <p className="text-gray-300 leading-relaxed">
                Built by developers, for developers. Every feature is designed 
                to streamline your workflow and boost productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                1000+
              </div>
              <div className="text-gray-300">APIs Available</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                50+
              </div>
              <div className="text-gray-300">Categories</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                99.9%
              </div>
              <div className="text-gray-300">Uptime</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                24/7
              </div>
              <div className="text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Popular Categories
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our most popular API categories used by thousands of developers worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '💳', name: 'Payment APIs', desc: 'Stripe, PayPal, Square' },
              { icon: '📱', name: 'Social Media', desc: 'Twitter, Instagram, TikTok' },
              { icon: '🌤️', name: 'Weather', desc: 'OpenWeather, AccuWeather' },
              { icon: '🗺️', name: 'Maps & Location', desc: 'Google Maps, Mapbox' },
              { icon: '🤖', name: 'AI & ML', desc: 'OpenAI, Hugging Face' },
              { icon: '📧', name: 'Communication', desc: 'Twilio, SendGrid' },
              { icon: '🔐', name: 'Authentication', desc: 'Auth0, Firebase' },
              { icon: '📊', name: 'Analytics', desc: 'Google Analytics, Mixpanel' }
            ].map((category, index) => (
              <div key={index} className="group p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300 cursor-pointer">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-white">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl border border-purple-500/20 backdrop-blur-sm">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Ready to Build?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who trust ConnectAPI for their integration needs. 
              Start building amazing applications today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <button className="group px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 border border-white/20 relative overflow-hidden text-lg">
                  <span className="relative z-10">Start Free Today</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </Link>
              <Link to="/learn-more">
                <button className="px-10 py-4 bg-white/10 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-lg">
                  View Documentation
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10 bg-black/20 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="text-3xl font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Connect</span>
                <span className="text-white">API</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The ultimate platform for API discovery and integration. 
                Empowering developers to build better applications faster.
              </p>
              <div className="text-gray-400 text-sm">
                © 2025 ConnectAPI. Crafted with ❤️ by Harsh
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
