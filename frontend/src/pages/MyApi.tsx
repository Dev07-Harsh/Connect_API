import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import MyApiListItem, { APIData } from "../Admincomponents/MyApiListItem";
import DeleteConfirmationModal from "../Admincomponents/DeleteConformation";

const MyAPIs: React.FC = () => {
  const [apis, setApis] = useState<APIData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchApis = async () => {
    try {
      const res = await axiosClient.get("/admin/my-apis");
      console.log("Response from /admin/my-apis:", res.data);
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setApis(res.data.data);
      } else {
        setApis([]);
      }
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching APIs:", err);
      setError(err.response?.data?.message || "Failed to fetch APIs");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApis();
  }, []);

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Edit functionality remains unchanged.
  const handleEdit = (api: APIData) => {
    console.log("Edit API:", api);
    // Your existing edit navigation logic (already implemented in MyApiListItem)
  };

  // When the delete button is clicked, set the deleteId to show the confirmation modal.
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  // On confirming deletion, send a DELETE request and update state.
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axiosClient.delete(`/admin/deleteApi/${deleteId}`);
      setApis((prev) => prev.filter((api) => api._id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete API");
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            My APIs
          </span>
        </h1>
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
            </div>
            <p className="text-lg text-gray-300 mt-4 animate-pulse">Loading your APIs...</p>
          </div>
        ) : error ? (
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center backdrop-blur-sm">
              <div className="text-4xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-red-400 mb-2">Error</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        ) : apis.length === 0 ? (
          <div className="mt-8 max-w-md mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No APIs Found</h3>
              <p className="text-gray-400">You haven't created any APIs yet.</p>
              <p className="text-sm text-gray-500 mt-2">Start by creating your first API!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {apis.map((api, index) => (
              <div 
                key={api._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MyApiListItem
                  api={api}
                  isExpanded={expandedId === api._id}
                  onToggle={() => toggleExpanded(api._id)}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Render the delete confirmation modal if deleteId is set */}
      {deleteId && (
        <DeleteConfirmationModal
          message="Are you sure you want to delete this API? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default MyAPIs;
