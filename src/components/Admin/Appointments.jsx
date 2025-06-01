import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Appointments() {
  // State for appointments data (raw data from API)
  const [rawAppointments, setRawAppointments] = useState([]);
  // State for processed and filtered appointments data
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Assuming nurses are fetched separately, keeping this state
  const [nurses, setNurses] = useState([]); 
  const [selectedNurse, setSelectedNurse] = useState('');

  // Fetch data when the component mounts
  useEffect(() => {
    fetchAppointments();
    // Keep fetching nurses separately if needed for assignment
    fetchNurses(); 
  }, []);

  // Process raw appointments and apply filters whenever raw data, search, date, or filter changes
  useEffect(() => {
    let processed = rawAppointments.map(request => ({
      // Map API data to appointment structure expected by the component
      id: request._id,
      parentId: request.parentId, // Keep parentId for potential future use
      childId: request.childId,   // Keep childId for potential future use
      vaccineId: request.vaccineId, // Keep vaccineId for potential future use
      // Displaying IDs or placeholder as names/details are not in this API response
      parentName: `Parent ID: ${request.parentId}`, // Replace with actual parent name if another API is available
      parentAvatar: null, // No avatar in this API response, use placeholder in JSX
      childName: `Child ID: ${request.childId}`, // Replace with actual child name if another API is available
      childAge: 'N/A', // Child age not in this API response
      vaccine: `Vaccine ID: ${request.vaccineId}`, // Replace with actual vaccine name if another API is available
      // Construct location from available address fields
      location: `${request.street || ''}, ${request.city || ''}, ${request.governorate || ''}`.replace(/, ,/g, ', ').replace(/^, /,'').replace(/, $/, '') || 'Location not specified',
      date: request.vaccinationDate ? new Date(request.vaccinationDate).toDateString() : 'Date not specified', // Format date
      time: 'Time not specified', // Time not in this API response, use placeholder
      status: request.status, // Status is available
      nurse: null // Assigned nurse not in this API response, adjust assignment logic later
    }));

    setAppointments(processed);

    let filtered = [...processed];
    
    // Filter by search term (search across the mapped fields)
    if (searchTerm) {
      filtered = filtered.filter(appointment => 
        appointment.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.vaccine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.date.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by date
    if (selectedDate) {
      const dateObj = new Date(selectedDate);
      filtered = filtered.filter(appointment => {
        // Ensure valid dates before comparing
        const appDate = new Date(appointment.date);
        return !isNaN(appDate.getTime()) && appDate.toDateString() === dateObj.toDateString();
      });
    }
    
    // Filter by unassigned only (status 'Pending' based on API)
    if (showUnassignedOnly) {
      filtered = filtered.filter(appointment => appointment.status === 'Pending');
    }
    
    setFilteredAppointments(filtered);

  }, [rawAppointments, searchTerm, selectedDate, showUnassignedOnly]); // Depend on rawAppointments here

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token'); // Assuming token is needed for admin API
      if (!token) {
          console.error('Authentication token not found for admin API');
          setIsLoading(false);
          // Optionally navigate to login or show an error message
          return;
      }
      
      const response = await axios.get('http://localhost:8000/api/vaccine-requests/admin', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      
      if (response.data && response.data.data) {
        // Store raw data and let the next useEffect process and filter it
        setRawAppointments(response.data.data);
      } else {
        console.error('API returned unexpected data structure:', response.data);
        setRawAppointments([]);
      }
      
    } catch (error) {
      console.error('Error fetching appointments:', error.response?.data || error.message);
      setRawAppointments([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  // Keep fetchNurses as is for now
  const fetchNurses = () => {
    // REPLACE THIS WITH YOUR API ENDPOINT for nurses
    // axios.get('YOUR_API_URL/nurses')
    //   .then(response => {
    //     setNurses(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching nurses:', error);
    //   });
    
    // Mock data for preview
    const mockNurses = [
      { id: 1, name: 'Dr. Jessica Smith' },
      { id: 2, name: 'Dr. Michael Brown' },
      { id: 3, name: 'Nurse Emily Davis' },
      { id: 4, name: 'Nurse Robert Johnson' }
    ];
    
    setNurses(mockNurses);
  };

  const handleAssignNurse = (appointmentId) => {
    if (!selectedNurse) {
      alert('Please select a nurse first');
      return;
    }

    // THIS ASSIGNMENT LOGIC NEEDS TO BE UPDATED to use your actual API for assigning nurses to vaccine requests
    console.log(`Attempting to assign nurse ${selectedNurse} to appointment ID ${appointmentId}`);

    // Example placeholder for API call:
    // axios.put(`YOUR_API_URL/vaccine-requests/${appointmentId}/assign-nurse`, { nurseId: selectedNurse }, {
    //    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    // })
    // .then(response => {
    //    console.log('Assignment successful', response.data);
    //    fetchAppointments(); // Refresh appointments after assignment
    //    setSelectedNurse('');
    // })
    // .catch(error => {
    //    console.error('Error assigning nurse:', error.response?.data || error.message);
    //    alert('Failed to assign nurse.');
    // });

    // For demo purposes (remove this section when implementing real API)
    const selectedNurseObj = nurses.find(nurse => nurse.id === parseInt(selectedNurse));
    if (selectedNurseObj) {
        const updatedRawAppointments = rawAppointments.map(request => {
            if (request._id === appointmentId) {
                 // Note: The API response structure doesn't include a nurse field,
                 // so this local update won't reflect in data fetched again unless the API changes
                return { ...request, status: 'Assigned', assignedNurseId: selectedNurseObj.id }; // Adding a dummy assignedNurseId
            }
            return request;
        });
         // Update raw data to trigger re-processing and re-rendering
        setRawAppointments(updatedRawAppointments);
        setSelectedNurse('');
        alert(`Nurse ${selectedNurseObj.name} assigned to appointment ${appointmentId} (Demo update only)`);
    } else {
        alert('Selected nurse not found (Demo issue)');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-6xl mx-auto py-10">

 {/* Appointment Requests Section */}
 <div className="mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Vaccine Requests</h2>
          
          <div className="flex items-center mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Filter button - keeping as is, logic handled by useEffect */}
             <button className="ml-3 p-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 flex items-center">
              <svg className="h-5 w-5 mr-1 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8H4a2 2 0 01-2-2v-4a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2h-2m-4 0h-4m-4 0h-4m0-8V9m0 3h.01M12 21v-7m0 0v-4.003M9 12h.01M7 12h-.01" />
              </svg>
              Filter
            </button>
          </div>
        </div>

{/* 
        Header with filters - keeping these filters, logic updated in useEffect */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
            <span className="ml-2 text-sm text-gray-700">Show pending only</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAppointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
              >
                <div className="p-4">
                  {/* Status Header */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      // Use status directly from the processed data
                      appointment.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {appointment.status}
                    </span>
                    {/* More options button - keeping as is */}
                    <button className="text-gray-400 hover:text-gray-500">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Parent Info */}
                  <div className="flex items-center mb-4">
                    {/* Using placeholder as avatar is not in API */}
                    <img 
                      src={"/placeholder.svg"} 
                      alt={appointment.parentName} 
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-800">{appointment.parentName}</h3>
                      <p className="text-sm text-gray-500">Parent ID</p>{/* Label updated to reflect displaying ID */}
                    </div>
                  </div>
                  
                  {/* Child Info */}
                  <div className="mb-2 flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-sm text-gray-700">{appointment.childName} ({appointment.childAge})</span>{/* Displaying Child ID for now */}
                  </div>
                  
                  {/* Vaccine Info */}
                  <div className="mb-2 flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">{appointment.vaccine}</span>{/* Displaying Vaccine ID for now */}
                  </div>
                  
                  {/* Location Info */}
                  <div className="mb-2 flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-700">{appointment.location}</span>
                  </div>
                  
                  {/* Date/Time Info */}
                  <div className="mb-4 flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">{appointment.date} - {appointment.time}</span>{/* Time is placeholder */}
                  </div>
                  
                  {/* Nurse Assignment */}
                  {/* Adjusted logic based on available status and lack of nurse info in API */}
                  {appointment.status === 'Pending' ? (
                    <div>
                      <div className="mb-3">
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          value={selectedNurse}
                          onChange={(e) => setSelectedNurse(e.target.value)}
                        >
                          <option value="">Select Nurse</option>
                          {nurses.map(nurse => (
                            <option key={nurse.id} value={nurse.id}>{nurse.name}</option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={() => handleAssignNurse(appointment.id)} // Pass appointment ID (which is the request _id)
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex justify-center items-center"
                      >
                        Assign & Send Request
                      </button>
                    </div>
                  ) : (
                    // Display a message or relevant info if not pending
                    <div className="flex items-center">
                         {/* Assuming you might want to show who it was assigned to if that API becomes available */}
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-gray-800">{appointment.status}</h4>
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