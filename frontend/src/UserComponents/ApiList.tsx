import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export interface APIData {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  usage?: string;
  documentationUrl: string;
  endpoint: string;
  provider: string;
}

interface UserApiListItemProps {
  api?: APIData;
  isExpanded: boolean;
  onToggle: () => void;
  searchQuery?: string;
  position?: number;
}

const UserApiListItem: React.FC<UserApiListItemProps> = ({ 
  api, 
  isExpanded, 
  onToggle, 
  searchQuery, 
  position 
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [trackingInProgress, setTrackingInProgress] = useState<string | null>(null);
  
  // Check bookmark status on mount
  useEffect(() => {
    checkBookmarkStatus();
  }, [api?._id]);

  const checkBookmarkStatus = async () => {
    if (!api?._id) return;
    try {
      const response = await axiosClient.get('/user/bookmarks');
      const isBookmarked = response.data.bookmarks.some(
        (bookmark: any) => bookmark.apiId === api._id
      );
      setIsBookmarked(isBookmarked);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  const trackInteraction = async (interactionType: string, additionalData?: any) => {
    if (!api?._id) return;
    
    setTrackingInProgress(interactionType);
    try {
      const response = await axiosClient.post('/user/track-interaction', {
        apiId: api._id,
        interactionType,
        metadata: {
          searchQuery,
          position,
          sessionId: sessionStorage.getItem('sessionId') || (() => {
            const sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('sessionId', sessionId);
            return sessionId;
          })(),
          ...additionalData
        }
      });
      
      // Return the response for further processing
      return response.data;
    } catch (error) {
      console.error('Error tracking interaction:', error);
    } finally {
      setTrackingInProgress(null);
    }
  };
  
  if (!api || !api._id) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 text-center text-white">
        <div className="text-gray-400">No API details available.</div>
      </div>
    );
  }

  const handleViewDocs = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Track the interaction first, then redirect
    const trackResult = await trackInteraction('view_docs');
    
    // Open documentation
    if (trackResult?.redirectUrl) {
      window.open(trackResult.redirectUrl, "_blank");
    } else {
      window.open(api.documentationUrl, "_blank");
    }
  };

  const handleCopyEndpoint = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(api.endpoint);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      
      // Track the copy interaction
      await trackInteraction('copy_endpoint', { endpoint: api.endpoint });
    } catch (error) {
      console.error('Failed to copy endpoint:', error);
    }
  };

  const handleQuickIntegrate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Track the interaction first
      await trackInteraction('quick_integrate');
      
      // Try the API endpoint
      const response = await axiosClient.post(`/user/try/${api._id}`);
      
      // Show the API response in a modal
      const responseData = JSON.stringify(response.data, null, 2);
      
      // Create a modal to show the response
      const modal = document.createElement('div');
      modal.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        ">
          <div style="
            background: #1a1a1a;
            color: white;
            padding: 20px;
            border-radius: 10px;
            max-width: 80%;
            max-height: 80%;
            overflow: auto;
            border: 1px solid #333;
          ">
            <h3 style="margin-top: 0; color: #10b981;">API Response from ${api.name}</h3>
            <pre style="
              background: #0f0f0f;
              padding: 15px;
              border-radius: 5px;
              overflow: auto;
              font-size: 12px;
              white-space: pre-wrap;
            ">${responseData}</pre>
            <button onclick="this.parentElement.parentElement.remove()" style="
              margin-top: 15px;
              background: #6366f1;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
            ">Close</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
    } catch (error: any) {
      console.error('Error with quick integrate:', error);
      alert(`API Test Failed: ${error.response?.data?.message || 'Failed to test API'}`);
    }
  };

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const response = await axiosClient.post('/user/bookmark', {
        apiId: api._id
      });
      
      setIsBookmarked(response.data.bookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
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
    <div 
      className={`group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 mb-6 transition-all duration-500 cursor-pointer overflow-hidden ${
        isExpanded ? 'border-purple-400/50 shadow-lg shadow-purple-500/10' : 'hover:border-white/20 hover:bg-white/10'
      }`}
    >
      {/* Header */}
      <div
        className="px-6 py-5 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{getCategoryIcon(api.category)}</span>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                {api.name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriceColor(api.price)} bg-white/10`}>
                {getPriceDisplay(api.price)}
              </span>
            </div>
            
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {api.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg border border-purple-500/30">
                {api.category}
              </span>
              <span className="text-gray-400">
                by {api.provider}
              </span>
            </div>
          </div>
          
          <div className="ml-4 flex items-center">
            <div className={`p-2 rounded-full bg-white/10 transition-all duration-300 ${
              isExpanded ? 'bg-purple-500/20 rotate-180' : 'group-hover:bg-white/20'
            }`}>
              <svg
                className="w-5 h-5 text-gray-400 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-6 pb-6 border-t border-white/10">
          <div className="pt-4 space-y-4">
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Usage</span>
                  <p className="text-white">{api.usage || "General purpose"}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Provider</span>
                  <p className="text-white">{api.provider}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400 text-sm">Endpoint</span>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-purple-300 bg-purple-500/10 px-3 py-1 rounded-lg text-sm flex-1 truncate border border-purple-500/20">
                      {api.endpoint}
                    </code>
                    <button
                      onClick={handleCopyEndpoint}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      title="Copy endpoint"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Copy Success Message */}
            {copySuccess && (
              <div className="mb-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
                <span className="text-green-400">✅ Endpoint copied to clipboard!</span>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleViewDocs}
                disabled={trackingInProgress === 'view_docs'}
                className="flex-1 group/btn px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {trackingInProgress === 'view_docs' ? (
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                  View Documentation
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
              
              <button
                onClick={handleQuickIntegrate}
                disabled={trackingInProgress === 'quick_integrate'}
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-white/20 border border-white/20 backdrop-blur-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {trackingInProgress === 'quick_integrate' ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  'Quick Integrate'
                )}
              </button>
              
              <button
                onClick={handleToggleBookmark}
                className={`px-4 py-3 font-semibold rounded-xl transition-all duration-300 border backdrop-blur-sm ${
                  isBookmarked 
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30' 
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                }`}
                title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
              >
                <svg className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserApiListItem);
