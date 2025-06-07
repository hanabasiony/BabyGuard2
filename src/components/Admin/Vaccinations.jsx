import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

function Vaccinations() {
  // State for vaccines data
  const [vaccines, setVaccines] = useState([]);
  const [filteredVaccines, setFilteredVaccines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch vaccines data from API
  useEffect(() => {
    fetchVaccines();
  }, []);

  const fetchVaccines = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token is missing. Please log in.");
        setIsLoading(false);
        return;
      }
      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net//api/vaccines",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVaccines(response.data.data);
      setFilteredVaccines(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching vaccines:", error);
      toast.error("Failed to fetch vaccines");
      setIsLoading(false);
    }
  };

  // Handle deleting a vaccine
  const handleDeleteVaccine = async (vaccineId) => {
    if (window.confirm("Are you sure you want to delete this vaccine?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Authentication token is missing. Please log in.");
          return;
        }
        const response = await axios.delete(
          `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net//api/vaccines/admin/${vaccineId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          toast.success("Vaccine deleted successfully");
          // Update the state by removing the deleted vaccine
          setVaccines((prevVaccines) =>
            prevVaccines.filter((vaccine) => vaccine._id !== vaccineId)
          );
          setFilteredVaccines((prevFilteredVaccines) =>
            prevFilteredVaccines.filter((vaccine) => vaccine._id !== vaccineId)
          );
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error deleting vaccine:", error);
        toast.error(
          error.response?.data?.message || "Failed to delete vaccine"
        );
      }
    }
  };

  // Handle search
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredVaccines(vaccines);
    } else {
      const filtered = vaccines.filter(
        (vaccine) =>
          vaccine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vaccine.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVaccines(filtered);
    }
  }, [searchTerm, vaccines]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-medium text-gray-800">
                Manage Vaccines
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                View and manage available vaccines and their schedules
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="px-4 py-2 bg-rose-300 text-white rounded-md hover:bg-rose-400 flex items-center justify-center w-full sm:w-auto"
                onClick={() => navigate("/admin/vaccinations/add")}
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
                Add Vaccine
              </button>
            </div>
          </div>
        </div>

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
              placeholder="Search vaccines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Vaccines Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Vaccine Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Required Age
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
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
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Loading vaccines...
                    </td>
                  </tr>
                ) : filteredVaccines.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No vaccines found
                    </td>
                  </tr>
                ) : (
                  filteredVaccines.map((vaccine) => (
                    <tr key={vaccine._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {vaccine.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {vaccine.requiredAge}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                        {vaccine.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${vaccine.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 justify-center">
                          {/* <button 
                            onClick={() => setEditingVaccine(vaccine)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button> */}
                          <button
                            onClick={() => handleDeleteVaccine(vaccine._id)}
                            className="text-red-600 hover:text-red-900"
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
      </div>

      {/* Edit Vaccine Modal */}
      {editingVaccine && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Vaccine
              </h2>
              <button
                onClick={() => setEditingVaccine(null)}
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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const vaccineData = {
                  _id: editingVaccine._id,
                  name: formData.get("name"),
                  requiredAge: formData.get("requiredAge"),
                  description: formData.get("description"),
                  price: parseFloat(formData.get("price")),
                  provider: formData.get("provider"),
                };
                handleEditVaccine(vaccineData);
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vaccine Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  defaultValue={editingVaccine.name}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-300 focus:border-rose-300"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="edit-requiredAge"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Required Age
                </label>
                <input
                  type="text"
                  id="edit-requiredAge"
                  name="requiredAge"
                  defaultValue={editingVaccine.requiredAge}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-300 focus:border-rose-300"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="edit-description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows="3"
                  defaultValue={editingVaccine.description}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-300 focus:border-rose-300"
                ></textarea>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="edit-price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="edit-price"
                  name="price"
                  step="0.01"
                  defaultValue={editingVaccine.price}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-300 focus:border-rose-300"
                />
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setEditingVaccine(null)}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-300 hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vaccinations;
