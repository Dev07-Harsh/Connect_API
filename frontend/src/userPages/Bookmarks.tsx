import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axiosClient from "../api/axiosClient";
import UserNavbar from "../UserComponents/userNavbar";

interface UserToken {
  id: string;
  name: string;
}

interface APIData {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  provider: string;
  endpoint: string;
  documentationUrl: string;
}

interface Bookmark {
  _id: string;
  apiId: string;
  note?: string;
  tags?: string[];
  createdAt: string;
  api: APIData;
}

const BookmarksPage: React.FC = () => {
  const [userName, setUserName] = useState("User");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await axiosClient.get("/user/bookmarks");
      setBookmarks(response.data.bookmarks || []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (bookmarkId: string, apiId: string) => {
    try {
      await axiosClient.post("/user/bookmark", { apiId });
      setBookmarks(bookmarks.filter(bookmark => bookmark._id !== bookmarkId));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.api?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.api?.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.api?.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('payment')) return '💳';
    if (categoryLower.includes('social')) return '📱';
    if (categoryLower.includes('weather')) return '🌤️';
    if (categoryLower.includes('map')) return '🗺️';
    if (categoryLower.includes('ai') || categoryLower.includes('ml')) return '🤖';
    return '🔧';
  };

  const getPriceDisplay = (price: number) => {
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  const getPriceColor = (price: number) => {
    if (price === 0) return 'text-green-400';
    if (price < 10) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white">
      <UserNavbar />
      
      <main className="pt-24 p-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              My Bookmarks
            </span>
          </h1>
          <p className="text-gray-300">Your saved APIs for quick access</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search your bookmarks..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 px-6 py-3">
            <span className="text-purple-400 font-semibold">{filteredBookmarks.length}</span>
            <span className="text-gray-400 ml-2">
              {filteredBookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {searchTerm ? '🔍' : '📚'}
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchTerm ? 'No matching bookmarks' : 'No bookmarks yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm 
                ? `No bookmarks match "${searchTerm}". Try a different search term.`
                : 'Start exploring APIs and bookmark your favorites for quick access!'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => window.location.href = '/user'}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl transition-all hover:scale-105"
              >
                Explore APIs
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark._id}
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:border-purple-400/30 transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryIcon(bookmark.api?.category)}</span>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">
                        {bookmark.api?.name}
                      </h3>
                      <p className="text-sm text-gray-400">{bookmark.api?.category}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriceColor(bookmark.api?.price)} bg-white/10`}>
                    {getPriceDisplay(bookmark.api?.price)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {bookmark.api?.description}
                </p>

                {/* Provider & Date */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>by {bookmark.api?.provider}</span>
                  <span>Saved {formatDate(bookmark.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(bookmark.api?.documentationUrl, "_blank")}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:scale-105 transition-all"
                  >
                    View Docs
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(bookmark.api?.endpoint)}
                    className="px-3 py-2 bg-white/10 text-gray-300 rounded-xl hover:bg-white/20 transition-colors"
                    title="Copy endpoint"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeBookmark(bookmark._id, bookmark.apiId)}
                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                    title="Remove bookmark"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookmarksPage;
