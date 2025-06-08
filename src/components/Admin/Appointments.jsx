import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function Appointments() {
  // State for appointments data (raw data from API)
  const [rawAppointments, setRawAppointments] = useState([]);
  // State for processed and filtered appointments data
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Assuming nurses are fetched separately, keeping this state
  const [nurses, setNurses] = useState([]);
  // Add a state to track selected nurses for each appointment
  const [selectedNurses, setSelectedNurses] = useState({});
  const [nurseSlots, setNurseSlots] = useState({}); // Add state for nurse slots
  const [selectedSlot, setSelectedSlot] = useState(null); // Add state for selected slot

  // Add status update handler
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token is missing. Please log in again.");
        return;
      }

      const response = await axios.patch(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/vaccine-requests/status/admin/${appointmentId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Update the local state
        const updatedRawAppointments = rawAppointments.map((request) => {
          if (request._id === appointmentId) {
            return { ...request, status: newStatus };
          }
          return request;
        });
        setRawAppointments(updatedRawAppointments);
        toast.success("Status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      if (error.response) {
        toast.error(
          error.response.data.message ||
            "Failed to update status. Please try again."
        );
      } else {
        toast.error("Error connecting to server. Please try again.");
      }
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchAppointments();
    // Keep fetching nurses separately if needed for assignment
    fetchNurses();
  }, []);

  // Process raw appointments and apply filters whenever raw data, search, date, or filter changes
  useEffect(() => {
    let processed = rawAppointments.map((request) => {
      // Add console.log to see the raw request data
      console.log("Raw Request Data:", {
        childName: request.child?.name,
        vaccineName: request.vaccine?.name,
        fullRequest: request,
      });

      return {
        // Map API data to appointment structure expected by the component
        id: request._id,
        childId: request.childId,
        vaccineId: request.vaccine?._id,
        parentName: request.parent?.name,
        childName: request.child?.name || "Child Name Not Available",
        vaccine: request.vaccine?.name || "Vaccine Name Not Available",
        location:
          `${request.street || ""}, ${request.city || ""}, ${
            request.governorate || ""
          }`
            .replace(/, ,/g, ", ")
            .replace(/^, /, "")
            .replace(/, $/, "") || "Location not specified",
        date: request.vaccinationDate
          ? new Date(request.vaccinationDate).toLocaleDateString()
          : "Date not specified",
        status: request.status,
        nurse: request.nurse?.name || null,
      };
    });

    // Add console.log to see the processed data
    console.log(
      "Processed Appointments Data:",
      processed.map((app) => ({
        childName: app.childName,
        vaccine: app.vaccine,
      }))
    );

    setAppointments(processed);

    let filtered = [...processed];

    // Update search to use the new fields
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.parentName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.childName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.vaccine
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.location
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appointment.date.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Rest of the filtering logic remains the same
    if (selectedDate) {
      const dateObj = new Date(selectedDate);
      filtered = filtered.filter((appointment) => {
        const appDate = new Date(appointment.date);
        return (
          !isNaN(appDate.getTime()) &&
          appDate.toDateString() === dateObj.toDateString()
        );
      });
    }

    if (showUnassignedOnly) {
      filtered = filtered.filter(
        (appointment) => appointment.status === "Pending"
      );
    }

    setFilteredAppointments(filtered);
  }, [rawAppointments, searchTerm, selectedDate, showUnassignedOnly]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found for admin API");
        setIsLoading(false);
        return;
      }

      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/vaccine-requests/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setRawAppointments(response.data.data);
      } else {
        console.error("API returned unexpected data structure:", response.data);
        setRawAppointments([]);
      }
    } catch (error) {
      console.error(
        "Error fetching appointments:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch appointments. Please try again.");
      setRawAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNurses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token is missing");
        return;
      }

      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/nurse",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        const nursesData = response.data.data.map((nurse) => ({
          id: nurse._id,
          name: `${nurse.fName} ${nurse.lName}`,
        }));
        setNurses(nursesData);
      } else {
        console.error("API returned unexpected data structure:", response.data);
        setNurses([]);
      }
    } catch (error) {
      console.error(
        "Error fetching nurses:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch nurses. Please try again.");
      setNurses([]);
    }
  };

  // Add function to fetch nurse slots
  const fetchNurseSlots = async (nurseId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token is missing");
        return;
      }

      const response = await axios.get(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/nurse/${nurseId}/free-slots`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setNurseSlots((prev) => ({
          ...prev,
          [nurseId]: response.data.data,
        }));
      } else {
        console.log("No slots data in response");
      }
    } catch (error) {
      console.error(
        "Error fetching nurse slots:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch available time slots. Please try again.");
    }
  };

  // Modify handleNurseSelection to fetch slots when a nurse is selected
  const handleNurseSelection = async (appointmentId, nurseId) => {
    setSelectedNurses((prev) => ({
      ...prev,
      [appointmentId]: nurseId,
    }));

    if (nurseId) {
      await fetchNurseSlots(nurseId);
    }
  };

  // Add this helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Add this helper function to group slots by date
  const groupSlotsByDate = (slots) => {
    return slots.reduce((acc, slot) => {
      const date = slot.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(slot);
      return acc;
    }, {});
  };

  // Update the slot selection UI in the render section
  {
    selectedNurses[appointments.id] &&
      nurseSlots[selectedNurses[appointments.id]] && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Time Slots
          </label>
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {Object.entries(
              groupSlotsByDate(nurseSlots[selectedNurses[appointment.id]])
            ).map(([date, slots]) => (
              <div
                key={date}
                className="border-b border-gray-200 last:border-b-0"
              >
                <div className="bg-gray-50 px-4 py-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    {formatDate(date)}
                  </h3>
                </div>
                <div className="grid grid-cols-4 gap-2 p-4">
                  {slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlotSelection(appointment.id, slot)}
                      className={`p-2 text-sm rounded-md transition-all duration-200 ${
                        selectedSlot?.appointmentId === appointment.id &&
                        selectedSlot?.slot.date === slot.date &&
                        selectedSlot?.slot.time === slot.time
                          ? "bg-blue-500 text-white ring-2 ring-blue-600 ring-offset-2 transform scale-105"
                          : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="font-medium">{slot.time}</div>
                      <div
                        className={`text-xs ${
                          selectedSlot?.appointmentId === appointment.id &&
                          selectedSlot?.slot.date === slot.date &&
                          selectedSlot?.slot.time === slot.time
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
  }

  // Update the handleSlotSelection function
  const handleSlotSelection = (appointmentId, slot) => {
    setSelectedSlot({
      appointmentId,
      slot: {
        ...slot,
        time: `${slot.startTime} - ${slot.endTime}`,
      },
    });
  };

  // Update the handleAssignNurse function to use the API
  const handleAssignNurse = async (appointmentId) => {
    const selectedNurseId = selectedNurses[appointmentId];
    if (!selectedNurseId) {
      toast.error("Please select a nurse first");
      return;
    }

    if (!selectedSlot || selectedSlot.appointmentId !== appointmentId) {
      toast.error("Please select a time slot first");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token is missing. Please log in again.");
        return;
      }

      const appointment = appointments.find((app) => app.id === appointmentId);
      if (!appointment) {
        toast.error("Appointment not found");
        return;
      }

      // Make the API call to assign the nurse
      const response = await axios.post(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/nurse/${selectedNurseId}/assign`,
        {
          slotId: selectedSlot.slot._id,
          vaccineId: appointment.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        // Update the local state
        const updatedRawAppointments = rawAppointments.map((request) => {
          if (request._id === appointmentId) {
            return {
              ...request,
              status: "Assigned",
              assignedNurseId: selectedNurseId,
              assignedSlot: selectedSlot.slot,
            };
          }
          return request;
        });
        setRawAppointments(updatedRawAppointments);
        setSelectedNurses((prev) => {
          const newState = { ...prev };
          delete newState[appointmentId];
          return newState;
        });
        setSelectedSlot(null);
        toast.success("Nurse assigned successfully!");
      }
    } catch (error) {
      console.error("Error assigning nurse:", error);
      if (error.response) {
        toast.error(
          error.response.data.message ||
            "Failed to assign nurse. Please try again."
        );
      } else {
        toast.error("Error connecting to server. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-6xl mx-auto py-10">
        {/* Appointment Requests Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Vaccine Requests
          </h2>

          <div className="flex items-center mb-4">
            <div className="relative flex-grow">
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
                className="block w-2xl pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 
        Header with filters - keeping these filters, logic updated in useEffect */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="date"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="mm/dd/yyyy"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              checked={showUnassignedOnly}
              onChange={(e) => setShowUnassignedOnly(e.target.checked)}
            />
            <span className="ml-2 text-sm text-gray-700">
              Show pending only
            </span>
          </label>
        </div>

        {/* Appointments Grid */}
        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading requests...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No requests found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
              >
                <div className="p-4">
                  {/* Status Header */}
                  <div className="flex justify-between items-center mb-4">
                    {appointment.status === "Pending" ? (
                      <select
                        className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border-0 focus:ring-2 focus:ring-yellow-500"
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusChange(appointment.id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    ) : appointment.status === "Confirmed" ? (
                      <select
                        className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border-0 focus:ring-2 focus:ring-green-500"
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusChange(appointment.id, e.target.value)
                        }
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appointment.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    )}
                    {/* More options button */}
                    <button className="text-gray-400 hover:text-gray-500">
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
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Child and Vaccine Info */}
                  <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg
                        className="h-5 w-5 mr-2"
                        style={{ color: '#8BCFE0' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          Parent Name:{" "}
                        </span>
                        <span className="text-sm text-gray-700">
                          {appointment.parentName}
                        </span>
                      </div>
                    </div>

                    {/* Child Name */}
                    <div className="flex items-center mb-2">
                      <svg
                        className="h-5 w-5 mr-2"
                        style={{ color: '#8BCFE0' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          Child Name:{" "}
                        </span>
                        <span className="text-sm text-gray-700">
                          {appointment.childName}
                        </span>
                      </div>
                    </div>

                    {/* Vaccine */}
                    <div className="flex items-center mb-2">
                      <svg
                        className="h-5 w-5 mr-2"
                        style={{ color: '#8BCFE0' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          Vaccine:{" "}
                        </span>
                        <span className="text-sm text-gray-700">
                          {appointment.vaccine}
                        </span>
                      </div>
                    </div>

                    {/* Location Info */}
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 mr-2"
                        style={{ color: '#8BCFE0' }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          Location:{" "}
                        </span>
                        <span className="text-sm text-gray-700">
                          {appointment.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Date/Time Info */}
                  <div className="mb-4 flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      style={{ color: '#8BCFE0' }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm text-gray-700">
                      {appointment.date} - {appointment.time}
                    </span>
                  </div>

                  {/* Nurse Assignment */}
                  {appointment.status === "Pending" ? (
                    <div>
                      <div className="mb-3">
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          value={selectedNurses[appointment.id] || ""}
                          onChange={(e) =>
                            handleNurseSelection(appointment.id, e.target.value)
                          }
                        >
                          <option value="">Select Nurse</option>
                          {nurses.map((nurse) => (
                            <option key={nurse.id} value={nurse.id}>
                              {nurse.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Slot Selection UI */}
                      {selectedNurses[appointment.id] &&
                        nurseSlots[selectedNurses[appointment.id]] && (
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Available Time Slots
                            </label>
                            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                              {Object.entries(
                                groupSlotsByDate(
                                  nurseSlots[selectedNurses[appointment.id]]
                                )
                              ).map(([date, slots]) => (
                                <div
                                  key={date}
                                  className="border-b border-gray-200 last:border-b-0"
                                >
                                  <div className="bg-gray-50 px-4 py-2">
                                    <h3 className="text-sm font-medium text-gray-900">
                                      {formatDate(date)}
                                    </h3>
                                  </div>
                                  <div className="grid grid-cols-4 gap-2 p-4">
                                    {slots.map((slot, index) => (
                                      <button
                                        key={index}
                                        onClick={() =>
                                          handleSlotSelection(
                                            appointment.id,
                                            slot
                                          )
                                        }
                                        className={`p-2 text-sm rounded-md transition-all duration-200 ${
                                          selectedSlot?.appointmentId ===
                                            appointment.id &&
                                          selectedSlot?.slot.date ===
                                            slot.date &&
                                          selectedSlot?.slot.time === slot.time
                                            ? "bg-blue-500 text-white ring-2 ring-blue-600 ring-offset-2 transform scale-105"
                                            : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-300"
                                        }`}
                                      >
                                        <div className="font-medium">
                                          {slot.time}
                                        </div>
                                        <div
                                          className={`text-xs ${
                                            selectedSlot?.appointmentId ===
                                              appointment.id &&
                                            selectedSlot?.slot.date ===
                                              slot.date &&
                                            selectedSlot?.slot.time ===
                                              slot.time
                                              ? "text-blue-100"
                                              : "text-gray-500"
                                          }`}
                                        >
                                          {slot.startTime} - {slot.endTime}
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      <button
                        onClick={() => handleAssignNurse(appointment.id)}
                        className="w-full bg-rose-300 hover:bg-rose-400 text-white py-2 px-4 rounded-md flex justify-center items-center"
                      >
                        Assign & Send Request
                      </button>
                    </div>
                  ) : (
                    // Display a message or relevant info if not pending
                    <div className="flex items-center">
                      {/* Assuming you might want to show who it was assigned to if that API becomes available */}
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-800">
                          {appointment.status}
                        </h4>
                        <p className="text-xs text-gray-500">Request Status</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Appointments;
