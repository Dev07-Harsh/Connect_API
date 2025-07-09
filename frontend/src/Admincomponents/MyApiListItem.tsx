import React from "react";
import { useNavigate } from "react-router-dom";
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

interface MyApiListItemProps {
  api: APIData;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: (api: APIData) => void;
  onDelete: (id: string) => void;
}

const MyApiListItem: React.FC<MyApiListItemProps> = ({
  api,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg mb-4 transition-all duration-300 hover:bg-white/10 hover:border-purple-400/50">
      {/* Header (Always visible) */}
      <div
        className="px-6 py-4 cursor-pointer flex justify-between items-center"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          <h3 className="text-xl font-bold text-white">{api.name}</h3>
        </div>
        <div className="text-purple-400 group-hover:text-purple-300 transition-colors">
          <svg
            className={`w-6 h-6 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
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

      {/* Expanded Content (Only rendered when isExpanded is true) */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-6">
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-3">
                <span className="text-purple-400 text-sm font-semibold">Category</span>
                <p className="text-white">{api.category}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <span className="text-purple-400 text-sm font-semibold">Price</span>
                <p className="text-white font-mono">${api.price}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <span className="text-purple-400 text-sm font-semibold">Usage</span>
                <p className="text-white">{api.usage || "N/A"}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-lg p-3">
                <span className="text-purple-400 text-sm font-semibold">Endpoint</span>
                <p className="text-white font-mono text-sm break-all">{api.endpoint}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <span className="text-purple-400 text-sm font-semibold">Provider</span>
                <p className="text-white">{api.provider}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <span className="text-purple-400 text-sm font-semibold">Description</span>
            <p className="text-gray-300 mt-1 leading-relaxed">{api.description}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <span className="text-purple-400 text-sm font-semibold">Documentation</span>
            <a
              href={api.documentationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors mt-1 block break-all"
            >
              {api.documentationUrl}
            </a>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                onEdit(api);
                navigate(`update-api/${api._id}`, { state: { api } });
              }}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 border border-white/20"
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(api._id)}
              className="px-8 py-3 bg-red-500/20 border border-red-500/30 text-red-400 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-red-500/30 backdrop-blur-sm"
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApiListItem;
