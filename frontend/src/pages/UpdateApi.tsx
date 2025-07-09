import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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

const EditApiPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Attempt to get API data from navigation state
  const stateApi = location.state?.api as APIData | undefined;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    usage: "",
    documentationUrl: "",
    endpoint: "",
    provider: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (stateApi) {
      setFormData({
        name: stateApi.name || "",
        category: stateApi.category || "",
        price: String(stateApi.price || ""),
        usage: stateApi.usage || "",
        documentationUrl: stateApi.documentationUrl || "",
        endpoint: stateApi.endpoint || "",
        provider: stateApi.provider || "",
        description: stateApi.description || "",
      });
      setLoading(false);
    } else {
      setError("No API details available. Please return to My APIs and try again.");
      setLoading(false);
    }
  }, [stateApi]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const dataToSend = { ...formData, price: Number(formData.price) };
      await axiosClient.put(`/admin/updateApi/${id}`, dataToSend);
      setSuccess("API updated successfully!");
      setTimeout(() => {
        navigate("/admin/my-apis");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update API");
    }
  };

  const handleCancel = () => {
    navigate("/admin/my-apis");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500 border-b-transparent rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="text-lg text-gray-300 mt-4 animate-pulse">Loading API details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pt-24 text-white flex flex-col items-center">
      <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Edit API
        </span>
      </h1>
      

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-center backdrop-blur-sm">
          <p className="text-red-400">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-center backdrop-blur-sm">
          <p className="text-green-400">{success}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-xl space-y-6"
      >
        {/* First row: API Name & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-purple-400 font-semibold">API Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="API Name"
              className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none backdrop-blur-sm"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-purple-400 font-semibold">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none backdrop-blur-sm"
              required
            />
          </div>
        </div>

        {/* Second row: Price & Usage */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-purple-400 font-semibold">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none backdrop-blur-sm"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-purple-400 font-semibold">Usage (Optional)</label>
            <input
              type="text"
              name="usage"
              value={formData.usage}
              onChange={handleChange}
              placeholder="Usage (Optional)"
              className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Third row: Documentation URL & Endpoint */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-purple-400 font-semibold">Documentation URL</label>
            <input
              type="url"
              name="documentationUrl"
              value={formData.documentationUrl}
              onChange={handleChange}
              placeholder="Documentation URL"
              className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none backdrop-blur-sm"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-purple-400 font-semibold">Endpoint</label>
            <input
              type="text"
              name="endpoint"
              value={formData.endpoint}
              onChange={handleChange}
              placeholder="Endpoint"
              className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none backdrop-blur-sm"
              required
            />
          </div>
        </div>

        {/* Fourth row: Provider */}
        <div>
          <label className="block mb-2 text-purple-400 font-semibold">Provider</label>
          <input
            type="text"
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            placeholder="Provider"
            className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none backdrop-blur-sm"
            required
          />
        </div>

        {/* Description: Full width Textarea */}
        <div>
          <label className="block mb-2 text-purple-400 font-semibold">API Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="API Description (Write a detailed description of your API)"
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none backdrop-blur-sm"
            required
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold rounded-full shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 border border-white/20"
          >
            Update API
          </button>
          <button
            type="button"
            onClick={() => handleCancel()}
            className="w-full py-3 mt-4 bg-white/10 text-white text-lg font-semibold rounded-full shadow-lg transform transition-all hover:scale-105 hover:bg-white/20 border border-white/20 backdrop-blur-sm"
          >
            Cancel
          </button>
        </div>
      </form>

    </div>
  );
};

export default EditApiPage;
