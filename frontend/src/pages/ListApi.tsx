import React, { useState } from "react";
import axiosClient from "../api/axiosClient";

const AdminListApiPage: React.FC = () => {
  // Form state for API details
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    usage: "",
    documentationUrl: "",
    endpoint: "",
    provider: "",
  });
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form and send POST request to create API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert price to a number and prepare data
      const dataToSend = { ...formData, price: Number(formData.price) };
      const res = await axiosClient.post("/admin/createApi", dataToSend);
      setMessage(res.data.message || "API listed successfully!");

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        price: "",
        usage: "",
        documentationUrl: "",
        endpoint: "",
        provider: "",
      });
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Failed to list API. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 pt-24">
      <div className="max-w-4xl mx-auto my-6 sm:my-8 md:my-10">
        <div
          className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-4 sm:p-6 md:p-8"
        >
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              List Your API Here
            </span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* First Row: API Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="API Name"
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none text-sm sm:text-base backdrop-blur-sm"
              />
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none text-sm sm:text-base backdrop-blur-sm"
              />
            </div>
            {/* Second Row: Price & Usage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none text-sm sm:text-base backdrop-blur-sm"
              />
              <input
                type="text"
                name="usage"
                value={formData.usage}
                onChange={handleChange}
                placeholder="Usage (Optional)"
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none text-sm sm:text-base backdrop-blur-sm"
              />
            </div>
            {/* Third Row: Documentation URL & Endpoint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="url"
                name="documentationUrl"
                value={formData.documentationUrl}
                onChange={handleChange}
                placeholder="Documentation URL"
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none text-sm sm:text-base backdrop-blur-sm"
              />
              <input
                type="text"
                name="endpoint"
                value={formData.endpoint}
                onChange={handleChange}
                placeholder="Endpoint"
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none text-sm sm:text-base backdrop-blur-sm"
              />
            </div>
            {/* Fourth Row: Provider (full width) */}
            <div>
              <input
                type="text"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                placeholder="Provider"
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none text-sm sm:text-base backdrop-blur-sm"
              />
            </div>
            {/* Description: Full width Textarea */}
            <div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="API Description (Write a detailed description of your API)"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-gray-400 shadow-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none text-sm sm:text-base backdrop-blur-sm"
              ></textarea>
            </div>
            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full sm:w-2/3 md:w-1/2 py-3 sm:py-4 mt-4 sm:mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base sm:text-lg font-semibold rounded-full shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 border border-white/20"
              >
                List API
              </button>
            </div>
          </form>
          {/* Message Div */}
          {message && (
            <div className="mt-6 p-4 bg-white/10 border border-white/20 rounded-lg text-center text-base sm:text-lg text-white backdrop-blur-sm">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminListApiPage;
