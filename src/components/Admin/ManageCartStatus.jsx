import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ManageCartStatus() {
  const [cartId, setCartId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    "Pending",
    "Delivered",
    "Online paid",
    "Waiting for cash payment",
    "Cancelled",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net//api/carts/status/admin/${cartId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Cart status updated successfully");
        setCartId("");
        setStatus("");
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error updating cart status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update cart status"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Manage Cart Status
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Update the status of a cart by entering its ID and selecting the
              new status.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cart ID */}
            <div>
              <label
                htmlFor="cartId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cart ID
              </label>
              <input
                type="text"
                id="cartId"
                value={cartId}
                onChange={(e) => setCartId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter cart ID"
              />
            </div>

            {/* Status Selection */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Select a status</option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                {loading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
