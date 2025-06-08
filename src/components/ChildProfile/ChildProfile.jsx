import React, { useEffect, useState } from "react";
import { Calendar, Bell, Plus, Info, Minus, X } from "lucide-react";
import { BabyIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoaderScreen from "../loaderScreen/loaderScreen";
import { Oval } from "react-loader-spinner";

export default function ChildDashboard() {
  const navigate = useNavigate();
  const [childData, setChildData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showDeleteRequestModal, setShowDeleteRequestModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [vaccineRequests, setVaccineRequests] = useState([]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    
    const birth = new Date(birthDate);
    const today = new Date();

    // Check if birth date is in the future
    if (birth > today) {
      return "Not born yet";
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""}`;
    } else {
      return `${months} month${months > 1 ? "s" : ""}`;
    }
  };

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/child/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data);
        
        const data = response.data?.data || [];
        console.log("Processed child data:", data);
        
        setChildData(data);
        
        // Only set selected child if we have data
        if (data && data.length > 0) {
          console.log("Setting selected child:", data[0]);
          setSelectedChild(data[0]);
        } else {
          console.log("No children data available");
          setSelectedChild(null);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching child data:", err);
        setError(err.message || "Failed to fetch child data");
        setLoading(false);
        toast.error("Failed to fetch child data");
      }
    };

    fetchChildData();
  }, []);

  useEffect(() => {
    const fetchVaccineRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/vaccine-requests/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        console.log("Vaccine requests response:", response.data);
        const requests = response.data?.data || [];
        setVaccineRequests(requests);
      } catch (err) {
        console.error("Error fetching vaccine requests:", err);
        toast.error("Failed to fetch vaccine requests");
      }
    };

    if (selectedChild) {
      fetchVaccineRequests();
    }
  }, [selectedChild]);

  const handleRemoveChild = async () => {
    if (!selectedChild?._id) {
      toast.error("No child selected for removal");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const res = await axios.delete(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/child/${selectedChild._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Child removed successfully");
      setShowRemoveModal(false);

      // Refresh the child list
      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/child/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newData = response.data?.data || [];
      setChildData(newData);
      
      if (newData.length > 0) {
        setSelectedChild(newData[0]);
      } else {
        setSelectedChild(null);
      }
    } catch (err) {
      console.error("Error removing child:", err);
      toast.error("Failed to remove child");
    }
  };

  const handleDeleteRequest = async () => {
    if (!selectedRequestId) {
      toast.error("No request selected for deletion");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      await axios.delete(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/vaccine-requests/${selectedRequestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVaccineRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== selectedRequestId)
      );

      toast.success("Vaccine request deleted successfully");
      setShowDeleteRequestModal(false);
      setSelectedRequestId(null);
    } catch (err) {
      console.error("Error deleting vaccine request:", err);
      toast.error("Failed to delete vaccine request");
    }
  };

  const openDeleteRequestModal = (requestId) => {
    setSelectedRequestId(requestId);
    setShowDeleteRequestModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Oval
          height={80}
          width={80}
          color="#fda4af"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#fb7185"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  // Early return if no children data
  if (!childData || childData.length === 0) {
    return (
      <div className="w-full bg-white">
        <div className="p-4 py-40 md:p-8 max-w-7xl mx-auto space-y-6 md:py-40 sm:py-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white rounded-2xl shadow">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <span className="text-lg sm:text-xl text-black whitespace-nowrap">
                You have no registered children
              </span>
              <button
                onClick={() => navigate("/add-child")}
                className="md:ms-auto m-auto cursor-pointer flex items-center justify-center px-4 py-2 bg-green-100 text-green-300 rounded hover:bg-green-200"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Child
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Remove Child Modal */}
      {showRemoveModal && selectedChild && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setShowRemoveModal(false)}
        >
          <div
            className="bg-white/95 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Remove Child</h3>
              <button
                onClick={() => setShowRemoveModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-bold">{selectedChild.name}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveChild}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Vaccine Request Modal */}
      {showDeleteRequestModal && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          onClick={() => setShowDeleteRequestModal(false)}
        >
          <div
            className="bg-white/95 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Delete Vaccine Request</h3>
              <button
                onClick={() => setShowDeleteRequestModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this vaccine request? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteRequestModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRequest}
                className="px-4 py-2 bg-red-300 text-white rounded-lg hover:bg-red-350 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 py-40 md:p-8 max-w-7xl mx-auto space-y-6 md:py-40 sm:py-50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 bg-white rounded-2xl shadow">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <span className="text-lg sm:text-xl text-black whitespace-nowrap ">
              You have {childData?.length || 0} Registered{" "}
              {childData?.length > 1 ? "children" : "child"}{" "}
              {childData?.length !== 0 ? ":" : ""}
            </span>
            {!childData?.length ? (
              <button
                onClick={() => navigate("/add-child")}
                className="md:ms-auto  m-auto cursor-pointer flex items-center justify-center px-4 py-2 bg-green-100 text-green-300 rounded hover:bg-green-200"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Child
              </button>
            ) : (
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 w-full sm:w-auto">
                {childData?.map((child) => (
                  <div key={child._id}>
                    <button
                      onClick={() => setSelectedChild(child)}
                      className={`px-4 py-2 cursor-pointer rounded-lg transition-all duration-100 ease-in-out transform hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-opacity-50 ${
                        selectedChild?._id === child._id
                          ? "bg-rose-300 text-white"
                          : "bg-rose-100 text-rose-600 hover:bg-rose-200"
                      }`}
                    >
                      {child.name}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {childData?.length > 0 && selectedChild && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl shadow bg-white">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedChild.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Age:{" "}
                    {selectedChild.birthDate
                      ? calculateAge(selectedChild.birthDate)
                      : "N/A"}{" "}
                    &bull; Gender: {selectedChild.gender}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => navigate("/add-child")}
                  className="cursor-pointer flex items-center justify-center px-4 py-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Child
                </button>
                <button
                  onClick={() => setShowRemoveModal(true)}
                  className="cursor-pointer flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  <Minus className="w-4 h-4 mr-2" /> Remove Child
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6">
              <div className="bg-white p-4 rounded-2xl shadow space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">
                    Vaccine Requests for {selectedChild.name}
                  </h3>
                  <button
                    onClick={() => navigate("/vacciens")}
                    className="inline-flex cursor-pointer items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-rose-300 hover:bg-rose-400"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Request
                  </button>
                </div>
                {vaccineRequests.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">
                      No vaccine requests found
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vaccineRequests
                      .filter(
                        (request) =>
                          request.child?.name.toLowerCase() ===
                          selectedChild.name.toLowerCase()
                      )
                      .map((request) => (
                        <div
                          key={request._id}
                          className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {request.vaccine
                                ? request.vaccine.name
                                : "Vaccine not specified"}
                            </p>
                            <p className="text-xs text-gray-500">
                              Child: {request.child?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(
                                request.vaccinationDate
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <p className="text-xs text-gray-500">
                              {request.street}, {request.city},{" "}
                              {request.governorate}
                            </p>
                            {request.nurse && (
                              <p className="text-xs text-gray-500">
                                Nurse: {request.nurse.name} -{" "}
                                {request.nurse.hospitalName}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                request.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : request.status === "Confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {request.status}
                            </span>
                            {request.status === "Pending" && (
                              <button
                                onClick={() =>
                                  openDeleteRequestModal(request._id)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
