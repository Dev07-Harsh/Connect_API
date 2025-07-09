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

interface Interaction {
  _id: string;
  interactionType: string;
  createdAt: string;
  metadata: {
    searchQuery?: string;
    position?: number;
  };
  api: APIData;
}

interface Bookmark {
  _id: string;
  apiId: string;
  note?: string;
  tags?: string[];
  createdAt: string;
  api: APIData;
}

const UserDashboard: React.FC = () => {
  const [userName, setUserName] = useState("User");
  const [activeTab, setActiveTab] = useState<"history" | "bookmarks">("history");
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalInteractions: 0,
    totalBookmarks: 0,
    topCategory: "N/A",
    mostUsedApi: "N/A"
  });

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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [interactionRes, bookmarkRes] = await Promise.all([
        axiosClient.get("/user/interaction-history?limit=20"),
        axiosClient.get("/user/bookmarks")
      ]);

      setInteractions(interactionRes.data.interactions || []);
      setBookmarks(bookmarkRes.data.bookmarks || []);

      // Calculate stats
      const totalInteractions = interactionRes.data.pagination?.total || 0;
      const totalBookmarks = bookmarkRes.data.bookmarks?.length || 0;
      
      // Find most popular category from interactions
      const categoryCount: { [key: string]: number } = {};
      interactionRes.data.interactions?.forEach((interaction: Interaction) => {
        const category = interaction.api?.category;
        if (category) {
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        }
      });
      
      const topCategory = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";
      
      // Find most used API
      const apiCount: { [key: string]: number } = {};
      interactionRes.data.interactions?.forEach((interaction: Interaction) => {
        const apiName = interaction.api?.name;
        if (apiName) {
          apiCount[apiName] = (apiCount[apiName] || 0) + 1;
        }
      });
      
      const mostUsedApi = Object.entries(apiCount).sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";

      setStats({
        totalInteractions,
        totalBookmarks,
        topCategory,
        mostUsedApi
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'view_docs': return '📖';
      case 'copy_endpoint': return '📋';
      case 'quick_integrate': return '⚡';
      case 'bookmark': return '⭐';
      case 'unbookmark': return '☆';
      default: return '📊';
    }
  };

  const getInteractionLabel = (type: string) => {
    switch (type) {
      case 'view_docs': return 'Viewed Documentation';
      case 'copy_endpoint': return 'Copied Endpoint';
      case 'quick_integrate': return 'Quick Integration';
      case 'bookmark': return 'Bookmarked';
      case 'unbookmark': return 'Removed Bookmark';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const removeBookmark = async (bookmarkId: string, apiId: string) => {
    try {
      await axiosClient.post("/user/bookmark", { apiId });
      setBookmarks(bookmarks.filter(bookmark => bookmark._id !== bookmarkId));
      setStats(prev => ({ ...prev, totalBookmarks: prev.totalBookmarks - 1 }));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white">
      <UserNavbar />
      
      <main className="pt-24 p-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-300">Welcome back, {userName}! Here's your API usage overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-purple-400">{stats.totalInteractions}</div>
            <div className="text-gray-400 text-sm">Total Interactions</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-yellow-400">{stats.totalBookmarks}</div>
            <div className="text-gray-400 text-sm">Bookmarks</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-lg font-bold text-green-400 truncate">{stats.topCategory}</div>
            <div className="text-gray-400 text-sm">Top Category</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
            <div className="text-3xl mb-2">🚀</div>
            <div className="text-lg font-bold text-blue-400 truncate">{stats.mostUsedApi}</div>
            <div className="text-gray-400 text-sm">Most Used API</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white/5 rounded-2xl p-2 backdrop-blur-md border border-white/10">
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "history"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            📈 Activity History
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "bookmarks"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            ⭐ Bookmarks
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 min-h-[400px]">
            {activeTab === "history" && (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Recent Activity</h3>
                {interactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📭</div>
                    <p className="text-gray-400">No activity yet. Start exploring APIs!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interactions.map((interaction) => (
                      <div
                        key={interaction._id}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{getInteractionIcon(interaction.interactionType)}</div>
                          <div>
                            <div className="font-semibold text-white">{interaction.api?.name}</div>
                            <div className="text-sm text-gray-400">{getInteractionLabel(interaction.interactionType)}</div>
                            {interaction.metadata?.searchQuery && (
                              <div className="text-xs text-purple-400">
                                Search: "{interaction.metadata.searchQuery}"
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">{formatDate(interaction.createdAt)}</div>
                          <div className="text-xs text-gray-500">{interaction.api?.category}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "bookmarks" && (
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Your Bookmarks</h3>
                {bookmarks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">📚</div>
                    <p className="text-gray-400">No bookmarks yet. Start saving your favorite APIs!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookmarks.map((bookmark) => (
                      <div
                        key={bookmark._id}
                        className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-yellow-500/30 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-white">{bookmark.api?.name}</h4>
                            <p className="text-sm text-gray-400">{bookmark.api?.category}</p>
                          </div>
                          <button
                            onClick={() => removeBookmark(bookmark._id, bookmark.apiId)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                            title="Remove bookmark"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                          {bookmark.api?.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            Saved {formatDate(bookmark.createdAt)}
                          </span>
                          <button
                            onClick={() => window.open(bookmark.api?.documentationUrl, "_blank")}
                            className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full hover:bg-purple-500/30 transition-colors"
                          >
                            View Docs
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
