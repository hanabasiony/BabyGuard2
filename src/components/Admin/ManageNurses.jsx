import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageNurses() {
  // State for nurses data
  const [nurses, setNurses] = useState([]);
  const [filteredNurses, setFilteredNurses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [startIndex, setStartIndex] = useState(1);
  const [endIndex, setEndIndex] = useState(0);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [limit, setLimit] = useState(10); // Default limit

  // Fetch nurses data from API
  useEffect(() => {
    fetchNurses(null, limit); // Fetch first page on mount
  }, []);

  const fetchNurses = async (cursor, limit) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token is missing. Please log in again.');
        setIsLoading(false);
        return;
      }

      // Build the API URL with query parameters
      const apiUrl = new URL('http://localhost:8000/api/nurse/');
      if (cursor) {
        apiUrl.searchParams.append('cursor', cursor);
      }
      apiUrl.searchParams.append('limit', limit);

      const response = await axios.get(apiUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Ensure response.data is an array
      const nursesData = Array.isArray(response.data.nurses) ? response.data.nurses : [];
      setNurses(nursesData);
      setFilteredNurses(nursesData);
      setNextPageToken(response.data.nextCursor || null);
      setTotalEntries(response.data.totalEntries || 0);

      // Update pagination display indices
      const currentStartIndex = (currentPage - 1) * limit + 1;
      const currentEndIndex = Math.min(currentPage * limit, response.data.totalEntries || 0);
      setStartIndex(currentStartIndex);
      setEndIndex(currentEndIndex);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching nurses:', error);
      setError('Failed to fetch nurses data');
      setNurses([]);
      setFilteredNurses([]);
      setNextPageToken(null);
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

    if (searchTerm === '') {
      setFilteredNurses(nurses);
    } else {
      const filtered = nurses.filter(nurse => 
        (nurse.name && nurse.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (nurse.hospital && nurse.hospital.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredNurses(filtered);
    }
  }, [searchTerm, nurses]);

  // Handle add new nurse
  const handleAddNurse = async (nurseData) => {
    try {
      // Validate required fields
      if (!nurseData.fName || nurseData.fName.length < 3 || nurseData.fName.length > 15) {
        alert('First name must be between 3 and 15 characters');
        return;
      }
      if (!nurseData.lName || nurseData.lName.length < 3 || nurseData.lName.length > 15) {
        alert('Last name must be between 3 and 15 characters');
        return;
      }
      if (!nurseData.email || !nurseData.email.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }
      // Format phone number to ensure it's exactly 11 digits
      const phoneNumber = nurseData.phone.replace(/\D/g, ''); // Remove non-digits
      if (!phoneNumber || phoneNumber.length !== 11) {
        alert('Phone number must be exactly 11 digits');
        return;
      }
      if (!nurseData.hospital) {
        alert('Hospital name is required');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Authentication token is missing. Please log in again.');
        return;
      }

      // Create FormData for image upload
      const formData = new FormData();
      formData.append('fName', nurseData.fName.trim());
      formData.append('lName', nurseData.lName.trim());
      formData.append('email', nurseData.email.trim());
      formData.append('phone', phoneNumber);
      formData.append('hospitalName', nurseData.hospital.trim());
      if (nurseData.image) {
        formData.append('image', nurseData.image);
      }

      // Log the data being sent
      console.log('Sending nurse data:', {
        fName: nurseData.fName.trim(),
        lName: nurseData.lName.trim(),
        email: nurseData.email.trim(),
        phone: phoneNumber,
        hospitalName: nurseData.hospital.trim(),
        hasImage: !!nurseData.image
      });

      // Log the FormData contents
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // Make API call
      const response = await axios.post('http://localhost:8000/api/nurse', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        // Refresh the nurses list
        fetchNurses();
        // Close the modal
        setShowAddModal(false);
        // Show success message
        alert('Nurse added successfully!');
      }
    } catch (error) {
      // Handle specific error cases
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        
        if (error.response.status === 409) {
          alert('Email or phone number already exists');
        } else if (error.response.status === 400) {
          // Show validation errors from the server
          const errorMessage = error.response.data.message || 'Validation failed. Please check your input.';
          alert(`Validation Error: ${errorMessage}`);
          // Log the specific validation errors if available
          if (error.response.data.errors) {
            console.error('Validation errors:', error.response.data.errors);
          }
        } else if (error.response.status === 401) {
          alert('Authentication failed. Please log in again.');
        } else {
          alert(error.response.data.message || 'Error adding nurse');
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        alert('No response received from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        console.error('Error message:', error.message);
        alert('Error setting up the request: ' + error.message);
      }
      console.error('Full error object:', error);
    }
  };

  // Handle edit nurse
  const handleEditNurse = async (nurseId, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:8000/api/nurse/${nurseId}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        fetchNurses();
        alert('Nurse updated successfully!');
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || 'Error updating nurse');
      } else {
        alert('Error connecting to server');
      }
      console.error('Error updating nurse:', error);
    }
  };

  // Handle assign nurse
  const handleAssignNurse = async (nurseId, assignmentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:8000/api/nurse/${nurseId}/assign`, assignmentData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        fetchNurses();
        setShowAssignModal(false);
        alert('Nurse assigned successfully!');
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || 'Error assigning nurse');
      } else {
        alert('Error connecting to server');
      }
      console.error('Error assigning nurse:', error);
    }
  };

  // Open assign modal
  const openAssignModal = (nurse) => {
    setSelectedNurse(nurse);
    setShowAssignModal(true);
  };

  // Open edit modal
  const openEditModal = (nurse) => {
    // REPLACE WITH YOUR IMPLEMENTATION
    console.log('Edit nurse:', nurse);
  };

  // Handle next page
  const handleNextPage = () => {
    if (nextPageToken) {
      setCurrentPage(prev => prev + 1);
      fetchNurses(nextPageToken, limit);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-medium text-gray-800">Manage Nurses</h2>
              <p className="mt-1 text-sm text-gray-500">View and manage registered nurses and their schedules</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 flex items-center justify-center w-full sm:w-auto"
                onClick={() => setShowAddModal(true)}
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
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
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nurse
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : !Array.isArray(filteredNurses) || filteredNurses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
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
                              className="h-10 w-10 rounded-full" 
                              src={nurse.profileImage || "/placeholder.svg"} 
                              alt={`${nurse.fName} ${nurse.lName}`} 
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
                        <div className="text-sm text-gray-900">{nurse.email}</div>
                        <div className="text-sm text-gray-500">{nurse.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {nurse.hospitalName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(nurse.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => openEditModal(nurse)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openAssignModal(nurse)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteNurse(nurse._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
        {!showAddModal && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={!nextPageToken}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex}</span> to <span className="font-medium">{endIndex}</span> of{' '}
                  <span className="font-medium">{totalEntries}</span> entries
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {/* {[1, 2, 3].map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === pageNumber
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } text-sm font-medium`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                   */}
                  
                  <button
                    onClick={handleNextPage}
                    disabled={!nextPageToken}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Nurse Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4 p-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Add New Nurse</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 pt-0 overflow-y-auto">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const nurseData = {
                  fName: formData.get('fName'),
                  lName: formData.get('lName'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  hospital: formData.get('hospital'),
                  image: formData.get('image') || null,
                };
                handleAddNurse(nurseData);
              }}>
                <div className="mb-4">
                  <label htmlFor="fName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name (3-15 characters)
                  </label>
                  <input
                    type="text"
                    id="fName"
                    name="fName"
                    required
                    minLength={3}
                    maxLength={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="lName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name (3-15 characters)
                  </label>
                  <input
                    type="text"
                    id="lName"
                    name="lName"
                    required
                    minLength={3}
                    maxLength={15}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (11 digits)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    pattern="[0-9]{11}"
                    maxLength={11}
                    placeholder="Enter 11 digits (e.g., 01234567890)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                    onChange={(e) => {
                      // Remove any non-digit characters
                      e.target.value = e.target.value.replace(/\D/g, '');
                    }}
                  />
                  <p className="mt-1 text-sm text-gray-500">Enter exactly 11 digits without spaces or special characters</p>
                </div>

                <div className="mb-4">
                  <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-1">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    id="hospital"
                    name="hospital"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Image (Optional)
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
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
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Add Nurse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedNurse && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Assign {selectedNurse.name}</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const assignmentData = {
                patient: formData.get('patient'),
                date: formData.get('date'),
                time: formData.get('time'),
                notes: formData.get('notes')
              };
              handleAssignNurse(selectedNurse.id, assignmentData);
            }}>
              <div className="mb-4">
                <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patient"
                  name="patient"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                ></textarea>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageNurses;