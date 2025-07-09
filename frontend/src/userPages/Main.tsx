import React, { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";
import {jwtDecode} from "jwt-decode";
import UserNavbar from "../UserComponents/userNavbar";
import SearchBar from "../UserComponents/SearchBar";
import UserApiListItem, { APIData } from "../UserComponents/ApiList";

interface UserToken {
  id: string;
  role: string;
  name: string;
}

const UserPage: React.FC = () => {
  const [userName, setUserName] = useState("User");
  const [searchResults, setSearchResults] = useState<APIData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [trendingApis, setTrendingApis] = useState<APIData[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(false);

  // Fetch trending APIs
  const fetchTrendingApis = useCallback(async () => {
    setTrendingLoading(true);
    try {
      const response = await axiosClient.get("/user/trending");
      setTrendingApis(response.data || []);
    } catch (error) {
      console.error("Error fetching trending APIs:", error);
    } finally {
      setTrendingLoading(false);
    }
  }, []);

  // Decode the user token once on mount
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const decoded = jwtDecode<UserToken>(token);
        if (decoded?.name) {
          setUserName(decoded.name);
        }
      } catch (error) {
        console.error("Error decoding user token:", error);
      }
    }
    
    // Fetch trending APIs on mount
    fetchTrendingApis();
  }, [fetchTrendingApis]);

  // Wrap the search function to ensure a stable reference
  const handleSearch = useCallback(async (query: string) => {
    // Clear previous results immediately when a new search is initiated
    setSearchResults([]);
    setLoading(true);
    setSearchError("");
    setSearchMessage("");
    setLastSearchQuery(query); // Store the search query
    try {
      const res = await axiosClient.post("/user/search", { query });
      console.log("Search response:", res.data);
      // Expected response: { message: "...", apis: [ ... ] }
      if (res.data && Array.isArray(res.data.apis)) {
        if (res.data.apis.length === 0) {
          setSearchMessage(res.data.message || "No APIs found.");
        } else {
          setSearchResults(res.data.apis);
          setSearchMessage("");
        }
      } else {
        setSearchMessage(res.data.message || "No APIs found.");
      }
    } catch (err: any) {
      console.error("Search error:", err.response?.data?.message || err.message);
      setSearchError(err.response?.data?.message || "Search failed");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Wrap the toggle function to prevent unnecessary re-renders
  const toggleExpanded = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white relative">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%),
                           radial-gradient(circle at 75% 25%, #06b6d4 0%, transparent 50%),
                           radial-gradient(circle at 25% 75%, #6366f1 0%, transparent 50%)`,
          backgroundSize: '800px 800px'
        }}></div>
      </div>
      
      {/* Elegant Static Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 rounded-full filter blur-3xl"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/4 to-purple-600/4 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-3/4 w-80 h-80 bg-gradient-to-br from-cyan-500/3 to-blue-600/3 rounded-full filter blur-3xl"></div>
      </div>

      {/* Navbar */}
      <UserNavbar />

      {/* Main Content */}
      <main className="pt-35 p-4 flex-grow relative z-10">
        {/* Hero Section */}
        <section className="text-center p-4 mb-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400">
                Welcome back,
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {userName}!
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Ready to discover amazing APIs? Search through our extensive collection.
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="max-w-6xl mx-auto">
          <SearchBar onSearch={handleSearch} />
          
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center mt-12">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
              </div>
              <p className="text-lg text-gray-300 mt-4 animate-pulse">Searching for APIs...</p>
            </div>
          )}
          
          {/* Error State */}
          {searchError && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center backdrop-blur-sm">
                <div className="text-4xl mb-4">❌</div>
                <h3 className="text-xl font-semibold text-red-400 mb-2">Search Failed</h3>
                <p className="text-red-300">{searchError}</p>
              </div>
            </div>
          )}
          
          {/* Empty State */}
          {!loading && searchResults.length === 0 && searchMessage && (
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No APIs Found</h3>
                <p className="text-gray-400">{searchMessage}</p>
                <p className="text-sm text-gray-500 mt-2">Try different keywords or browse our popular categories above.</p>
              </div>
            </div>
          )}
          
          {/* Results */}
          {searchResults.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Found {searchResults.length} API{searchResults.length !== 1 ? 's' : ''}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Click any card to expand details
                </div>
              </div>
              
              <div className="space-y-4">
                {searchResults.map((api, index) => (
                  <div 
                    key={api._id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <UserApiListItem
                      api={api}
                      isExpanded={expandedId === api._id}
                      onToggle={() => toggleExpanded(api._id)}
                      searchQuery={lastSearchQuery}
                      position={index}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Trending APIs Section */}
        {!loading && searchResults.length === 0 && !searchMessage && (
          <section className="max-w-6xl mx-auto mt-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                  🔥 Trending APIs
                </span>
              </h2>
              <p className="text-gray-300">Discover the most popular APIs used by developers</p>
            </div>

            {trendingLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : trendingApis.length > 0 ? (
              <div className="space-y-4">
                {trendingApis.slice(0, 5).map((api, index) => (
                  <div 
                    key={api._id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <UserApiListItem
                      api={api}
                      isExpanded={expandedId === api._id}
                      onToggle={() => toggleExpanded(api._id)}
                      searchQuery=""
                      position={index}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-gray-400">No trending APIs available at the moment</p>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Enhanced Footer */}
      <footer className="relative z-10 mt-16 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="text-2xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Connect</span>
                <span className="text-white">API</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400">Discover. Integrate. Build.</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 ConnectAPI. Crafted with ❤️ by Harsh
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserPage;