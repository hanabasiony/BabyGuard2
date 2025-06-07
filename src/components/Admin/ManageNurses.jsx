import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function ManageNurses() {
  // State for nurses data
  const [nurses, setNurses] = useState([]);
  const [filteredNurses, setFilteredNurses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [startIndex, setStartIndex] = useState(1);
  const [endIndex, setEndIndex] = useState(0);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [limit, setLimit] = useState(10);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [pageHistory, setPageHistory] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");

  // Fetch providers data
  const fetchProviders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token is missing. Please log in again.");
        return;
      }

      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net//api/provider",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setProviders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
      toast.error("Failed to fetch providers");
    }
  };

  // Fetch nurses data from API
  useEffect(() => {
    fetchNurses(null, limit);
    fetchProviders();

    // Add event listener for nurses updates
    const handleNursesUpdate = (event) => {
      const updatedNurses = event.detail.nurses;
      setNurses(updatedNurses);
      setFilteredNurses(updatedNurses);
      setTotalEntries(updatedNurses.length);
      setEndIndex(updatedNurses.length);
    };

    window.addEventListener("nursesUpdated", handleNursesUpdate);

    // Cleanup
    return () => {
      window.removeEventListener("nursesUpdated", handleNursesUpdate);
    };
  }, []);

  const fetchNurses = async (cursor, limit) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Authentication token is missing. Please log in again.");
        setIsLoading(false);
        return;
      }

      const apiUrl = new URL(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net//api/nurse?limit=100"
      );
      if (cursor) {
        apiUrl.searchParams.append("cursor", cursor);
      }
      apiUrl.searchParams.append("limit", limit);

      const response = await axios.get(apiUrl.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data); // Debug log

      const nursesData = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      setNurses(nursesData);
      setFilteredNurses(nursesData);
      setNextPageToken(response.data.nextCursor || null);
      setPrevPageToken(cursor || null);
      setTotalEntries(response.data.totalEntries || 0);

      // Update page history
      if (cursor) {
        setPageHistory((prev) => [...prev, cursor]);
      }

      const currentStartIndex = (currentPage - 1) * limit + 1;
      const currentEndIndex = Math.min(
        currentStartIndex + nursesData.length - 1,
        response.data.totalEntries || 0
      );
      setStartIndex(currentStartIndex);
      setEndIndex(currentEndIndex);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching nurses:", error);
      setError("Failed to fetch nurses data");
      setNurses([]);
      setFilteredNurses([]);
      setNextPageToken(null);
      setPrevPageToken(null);
      setTotalEntries(0);
      setStartIndex(0);
      setEndIndex(0);
      setIsLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (!Array.isArray(nurses)) {
      setFilteredNurses([]);
      return;
    }

    if (searchTerm === "") {
      setFilteredNurses(nurses);
    } else {
      const filtered = nurses.filter((nurse) => {
        const fullName = `${nurse.fName || ""} ${
          nurse.lName || ""
        }`.toLowerCase();
        const hospital = (nurse.hospitalName || "").toLowerCase();
        const term = searchTerm.toLowerCase();
        return fullName.includes(term) || hospital.includes(term);
      });
      setFilteredNurses(filtered);
    }
  }, [searchTerm, nurses]);

  // Handle add new nurse
  const handleAddNurse = async (nurseData) => {
    try {
      // Validate required fields
      if (
        !nurseData.fName ||
        nurseData.fName.length < 3 ||
        nurseData.fName.length > 15
      ) {
        toast.error("First name must be between 3 and 15 characters");
        return;
      }
      if (
        !nurseData.lName ||
        nurseData.lName.length < 3 ||
        nurseData.lName.length > 15
      ) {
        toast.error("Last name must be between 3 and 15 characters");
        return;
      }
      if (!nurseData.email || !nurseData.email.includes("@")) {
        toast.error("Please enter a valid email address");
        return;
      }
      if (!nurseData.phone) {
        toast.error("Phone number is required");
        return;
      }
      if (!nurseData.hospital) {
        toast.error("Hospital name is required");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token is missing. Please log in again.");
        return;
      }

      // Prepare the request body
      const requestBody = {
        fName: nurseData.fName.trim(),
        lName: nurseData.lName.trim(),
        email: nurseData.email.trim(),
        phone: nurseData.phone.trim(),
        hospitalName: nurseData.hospital.trim(),
      };

      // Make API call
      const response = await axios.post(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net//api/nurse",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'application/json'
          },
        }
      );

      if (response.status === 201) {
        // Add the new nurse to the state arrays
        const newNurse = response.data.data; // Access the nested data
        // Ensure we're working with arrays
        setNurses((prevNurses) =>
          Array.isArray(prevNurses) ? [...prevNurses, newNurse] : [newNurse]
        );
        setFilteredNurses((prevFiltered) =>
          Array.isArray(prevFiltered) ? [...prevFiltered, newNurse] : [newNurse]
        );
        setTotalEntries((prevTotal) => prevTotal + 1);
        setEndIndex((prevEnd) => prevEnd + 1);
        setShowAddModal(false);
        toast.success("Nurse added successfully!");
        console.log("add nurse", response.data.data);
      }
    } catch (error) {
      // Handle specific error cases
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);

        if (error.response.status === 409) {
          toast.error("Email or phone number already exists");
        } else if (error.response.status === 400) {
          const errorMessage =
            error.response.data.message ||
            "Validation failed. Please check your input.";
          toast.error(`Validation Error: ${errorMessage}`);
        } else if (error.response.status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else {
          toast.error(error.response.data.message || "Error adding nurse");
        }
      } else if (error.request) {
        toast.error(
          "No response received from server. Please check your connection."
        );
      } else {
        toast.error("Error setting up the request: " + error.message);
      }
      console.error("Full error object:", error);
    }
  };

  // Handle edit nurse
  const handleEditNurse = async (nurseId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      /* Commented out edit API
      const response = await axios.put(`https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net//api/nurse/${nurseId}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        fetchNurses();
        alert('Nurse updated successfully!');
      }
      */
      console.log("Edit nurse functionality commented out:", {
        nurseId,
        updatedData,
      });
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Error updating nurse");
      } else {
        alert("Error connecting to server");
      }
      console.error("Error updating nurse:", error);
    }
  };

  // Handle delete nurse
  const handleDeleteNurse = async (nurseId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token is missing. Please log in again.");
        return;
      }

      // Show confirmation toast
      const confirmDelete = await new Promise((resolve) => {
        toast.custom(
          (t) => (
            <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
              <p className="mb-4 text-gray-800">
                Are you sure you want to delete this nurse?
              </p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-rose-300 text-white rounded hover:bg-rose-400"
                  onClick={async () => {
                    toast.dismiss(t.id);
                    resolve(true);
                  }}
                >
                  Yes, Delete
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={() => {
                    toast.dismiss(t.id);
                    resolve(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
          {
            duration: Infinity,
            position: "top-center",
          }
        );
      });

      if (!confirmDelete) {
        return;
      }

      // Make the DELETE request to the API
      await axios.delete(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net//api/nurse/${nurseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // If we reach here, the deletion was successful
      setNurses((prevNurses) =>
        prevNurses.filter((nurse) => nurse._id !== nurseId)
      );
      setFilteredNurses((prevFiltered) =>
        prevFiltered.filter((nurse) => nurse._id !== nurseId)
      );
      setTotalEntries((prev) => prev - 1);
      setEndIndex((prev) => prev - 1);
      toast.success("Nurse deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);

      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Authentication failed. Please log in again.");
        } else if (error.response.status === 404) {
          toast.error("Nurse not found.");
        } else {
          toast.error(
            error.response.data?.message ||
              "Failed to delete nurse. Please try again."
          );
        }
      } else if (error.request) {
        toast.error(
          "No response received from server. Please check your connection."
        );
      } else {
        toast.error("Error setting up the request. Please try again.");
      }
    }
  };

  // Open edit modal
  const openEditModal = (nurse) => {
    // REPLACE WITH YOUR IMPLEMENTATION
    console.log("Edit nurse:", nurse);
  };

  // Handle next page
  const handleNextPage = () => {
    if (nextPageToken) {
      setCurrentPage((prev) => prev + 1);
      fetchNurses(nextPageToken, limit);
    }
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (pageHistory.length > 0) {
      const prevCursor = pageHistory[pageHistory.length - 2] || null;
      setPageHistory((prev) => prev.slice(0, -1));
      setCurrentPage((prev) => prev - 1);
      fetchNurses(prevCursor, limit);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/35 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-medium text-gray-800">
                Manage Nurses
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View and manage registered nurses
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="px-4 py-2 bg-rose-300 text-white rounded-md hover:bg-rose-400 flex items-center justify-center w-full sm:w-auto"
                onClick={() => setShowAddModal(true)}
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add New Nurse
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-grow max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name or hospital"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Nurses Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nurse
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact Info
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hospital
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-red-500"
                    >
                      {error}
                    </td>
                  </tr>
                ) : !Array.isArray(filteredNurses) ||
                  filteredNurses.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No nurses found
                    </td>
                  </tr>
                ) : (
                  filteredNurses.map((nurse) => (
                    <tr key={nurse._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={nurse.profileImage}
                              alt={`${nurse.fName} ${nurse.lName}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {nurse.fName} {nurse.lName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {nurse.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {nurse.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {nurse.hospitalName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleDeleteNurse(nurse._id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                            title="Delete Nurse"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-end space-x-2 pr-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={!nextPageToken}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              !nextPageToken
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Nurse Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600/30 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4 p-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Nurse
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 pt-0 overflow-y-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const nurseData = {
                    fName: formData.get("fName"),
                    lName: formData.get("lName"),
                    email: formData.get("email"),
                    phone: formData.get("phone"),
                    hospital: formData.get("hospital"),
                  };
                  handleAddNurse(nurseData);
                }}
              >
                <div className="mb-4">
                  <label
                    htmlFor="fName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name (3-15 characters)
                  </label>
                  <input
                    type="text"
                    id="fName"
                    name="fName"
                    required
                    minLength={3}
                    maxLength={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-300 focus:border-rose-400"
                    placeholder="Enter first name"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="lName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name (3-15 characters)
                  </label>
                  <input
                    type="text"
                    id="lName"
                    name="lName"
                    required
                    minLength={3}
                    maxLength={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-300 focus:border-rose-300"
                    placeholder="Enter last name"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-300 focus:border-rose-400"
                    placeholder="Enter email address"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-300 focus:border-rose-300"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="hospital"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Provider Name
                  </label>
                  <select
                    id="hospital"
                    name="hospital"
                    required
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-300 focus:border-rose-300"
                  >
                    <option value="">Select a provider</option>
                    {providers.map((provider) => (
                      <option key={provider._id} value={provider.name}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-300 hover:rose-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-300"
                  >
                    Add Nurse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageNurses;
