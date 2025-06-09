import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// Create a context for user data
const UserDataContext = createContext();

// Custom hook to use the user data
export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserDataProvider");
  }
  return context;
};

// Provider component
export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/user/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData(response.data.user);
      setError(null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.response?.data?.message || "Failed to fetch user data");
      if (localStorage.getItem("role") !== "admin") {
        // toast.error("Failed to load user data");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Function to refresh user data
  const refreshUserData = () => {
    fetchUserData();
  };

  const value = {
    userData,
    loading,
    error,
    refreshUserData,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

// Example usage component
export default function GetUserData() {
  const { userData, loading, error, refreshUserData } = useUserData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={refreshUserData}
          className="mt-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return null; // This component doesn't render anything by defaults
}
