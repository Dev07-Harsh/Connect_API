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
    endpoint?: string;
  };
  api: APIData;
}

const HistoryPage: React.FC = () => {
  const [userName, setUserName] = useState("User");
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
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
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axiosClient.get("/user/interaction-history?limit=100");
      setInteractions(response.data.interactions || []);
    } catch (error) {
      console.error("Error fetching history:", error);
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

  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'view_docs': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'copy_endpoint': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'quick_integrate': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'bookmark': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'unbookmark': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-white/10 text-white border-white/20';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 2) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const filteredInteractions = interactions.filter(interaction => {
    const matchesType = filterType === "all" || interaction.interactionType === filterType;
    const matchesSearch = searchTerm === "" || 
      interaction.api?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interaction.api?.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interaction.metadata?.searchQuery?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  const interactionTypes = [
    { value: "all", label: "All Activities", icon: "📊" },
    { value: "view_docs", label: "Documentation Views", icon: "📖" },
    { value: "copy_endpoint", label: "Endpoint Copies", icon: "📋" },
    { value: "quick_integrate", label: "Quick Integrations", icon: "⚡" },
    { value: "bookmark", label: "Bookmarks Added", icon: "⭐" },
    { value: "unbookmark", label: "Bookmarks Removed", icon: "☆" }
  ];

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('payment')) return '💳';
    if (categoryLower.includes('social')) return '📱';
    if (categoryLower.includes('weather')) return '🌤️';
    if (categoryLower.includes('map')) return '🗺️';
    if (categoryLower.includes('ai') || categoryLower.includes('ml')) return '🤖';
    return '🔧';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white">
      <UserNavbar />
      
      <main className="pt-24 p-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Activity History
            </span>
          </h1>
          <p className="text-gray-300">Track your API exploration journey</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search your activity..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Activity Type Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {interactionTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilterType(type.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  filterType === type.value
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                <span className="mr-2">{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 px-6 py-3">
            <span className="text-purple-400 font-semibold">{filteredInteractions.length}</span>
            <span className="text-gray-400 ml-2">
              {filteredInteractions.length === 1 ? 'activity' : 'activities'}
              {(searchTerm || filterType !== 'all') && ' found'}
            </span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredInteractions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {searchTerm || filterType !== 'all' ? '🔍' : '📭'}
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchTerm || filterType !== 'all' ? 'No matching activities' : 'No activity yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filter settings.'
                : 'Start exploring APIs to see your activity history!'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <button
                onClick={() => window.location.href = '/user'}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl transition-all hover:scale-105"
              >
                Explore APIs
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInteractions.map((interaction, index) => (
              <div
                key={interaction._id}
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:border-purple-400/30 transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl ${getInteractionColor(interaction.interactionType)}`}>
                      {getInteractionIcon(interaction.interactionType)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {interaction.api?.name}
                          </h3>
                          <span className="text-2xl">{getCategoryIcon(interaction.api?.category)}</span>
                        </div>
                        
                        <p className="text-purple-300 font-medium mb-1">
                          {getInteractionLabel(interaction.interactionType)}
                        </p>
                        
                        <p className="text-gray-400 text-sm mb-3">
                          {interaction.api?.category} • by {interaction.api?.provider}
                        </p>

                        {/* Metadata */}
                        {interaction.metadata?.searchQuery && (
                          <div className="mb-2">
                            <span className="text-xs text-gray-500">Search query: </span>
                            <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded">
                              "{interaction.metadata.searchQuery}"
                            </span>
                          </div>
                        )}

                        {interaction.interactionType === 'copy_endpoint' && interaction.metadata?.endpoint && (
                          <div className="mb-2">
                            <span className="text-xs text-gray-500">Endpoint: </span>
                            <code className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded font-mono">
                              {interaction.metadata.endpoint}
                            </code>
                          </div>
                        )}
                      </div>

                      {/* Time and Actions */}
                      <div className="flex flex-col items-end space-y-2">
                        <span className="text-sm text-gray-400">
                          {formatDate(interaction.createdAt)}
                        </span>
                        
                        {interaction.interactionType === 'view_docs' && (
                          <button
                            onClick={() => window.open(interaction.api?.documentationUrl, "_blank")}
                            className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full hover:bg-blue-500/30 transition-colors"
                          >
                            View Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
