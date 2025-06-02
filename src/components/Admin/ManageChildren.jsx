import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageChildren() {
  // State for children data
  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null); // For edit/details modal
  const [showFilters, setShowFilters] = useState(false); // Placeholder
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Placeholder, depends on API
  const [totalEntries, setTotalEntries] = useState(0); // Placeholder, depends on API
  const [startIndex, setStartIndex] = useState(1); // Placeholder, depends on API
  const [endIndex, setEndIndex] = useState(0); // Placeholder, depends on API
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null); // For cursor-based pagination
  const [limit, setLimit] = useState(10); // Default limit for pagination

  // Fetch children data from API
  useEffect(() => {
    fetchChildren(null, limit);
  }, []);

  const fetchChildren = async (cursor, limit) => {
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
      const apiUrl = new URL('http://localhost:8000/api/child/admin'); // Updated endpoint for admin view
      if (cursor) {
        apiUrl.searchParams.append('cursor', cursor);
      }
      apiUrl.searchParams.append('limit', limit);

      const response = await axios.get(apiUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      // Assuming the API returns an object with 'data' (array of children), 'nextCursor', and 'totalEntries'
      const childrenData = Array.isArray(response.data.data) ? response.data.data : [];
      setChildren(childrenData); // Store the current page's children
      setFilteredChildren(childrenData); // Filter applies to the current page
      setNextPageToken(response.data.nextCursor || null); // Store next cursor as next page token
      setTotalEntries(response.data.totalEntries || 0); // Store total entries

      // Update pagination display indices (adjust based on actual pagination implementation)
      const currentStartIndex = (currentPage - 1) * limit + 1;
      const currentEndIndex = Math.min(currentStartIndex + childrenData.length - 1, response.data.totalEntries || 0);
      setStartIndex(currentStartIndex);
      setEndIndex(currentEndIndex);

      setIsLoading(false);
      console.log('Fetched children:', response.data);

    } catch (error) {
      console.error('Error fetching children:', error);
      setError('Failed to fetch children data');
      setChildren([]);
      setFilteredChildren([]);
      setNextPageToken(null);
      setTotalEntries(0);
      setStartIndex(0);
      setEndIndex(0);
      setIsLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (!Array.isArray(children)) {
      setFilteredChildren([]);
      return;
    }

    if (searchTerm === '') {
      setFilteredChildren(children);
    } else {
      const filtered = children.filter(child =>
        (child.name && child.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (child.userId && child.userId.toLowerCase().includes(searchTerm.toLowerCase())) // Assuming search by user ID is useful
      );
      setFilteredChildren(filtered);
    }
  }, [searchTerm, children]);

  // Handle add new child
  const handleAddChild = async (childData) => {
    console.log('Adding child:', childData); // Placeholder
    // Implement API call to add child
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authentication token is missing. Please log in again.');
            return;
        }
        // Adjust endpoint and data format as needed for your API
        const formData = new FormData(); // Use FormData for file uploads
        formData.append('name', childData.name.trim());
        formData.append('birthDate', childData.birthDate); // Assuming date format is correct
        formData.append('gender', childData.gender);
        formData.append('bloodType', childData.bloodType);
        formData.append('ssn', childData.ssn.trim());
        // Assuming userId is needed when creating a child
        if (childData.userId) {
             formData.append('userId', childData.userId.trim());
        }
        if (childData.birthCertificate) {
             formData.append('birthCertificate', childData.birthCertificate);
        }

        // Log the data being sent
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        const response = await axios.post('http://localhost:8000/api/child', formData, { // API endpoint for adding a child
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data', // Use multipart/form-data for FormData
            },
        });

        if (response.status === 201) {
            alert('Child added successfully!');
            setCurrentPage(1); // Reset to the first page
            fetchChildren(null, limit); // Refresh list from beginning to see new child
            setShowAddModal(false);
        } else {
             alert(response.data.message || 'Error adding child');
        }
    } catch (error) {
        console.error('Error adding child:', error);
         if (error.response) {
            console.error('Error response data:', error.response.data);
            alert(error.response.data.message || `Error adding child: ${error.response.status}`);
         } else {
            alert('Error connecting to server');
         }
    }
  };

  // Handle edit child (Placeholder)
  const handleEditChild = async (childId, updatedData) => {
    console.log('Editing child:', childId, updatedData);
    // Implement API call to edit child
    alert('Edit functionality not yet implemented');
  };

  // Handle delete child (Placeholder)
  const handleDeleteChild = async (childId) => {
    console.log('Deleting child:', childId);
    // Implement API call to delete child
     alert('Delete functionality not yet implemented');
  };

  // Handle assign/view details for child (Placeholder)
   const handleChildAction = (child) => {
       console.log('Performing action on child:', child);
       alert('Action functionality not yet implemented');
   };

  // Handle next page
  const handleNextPage = () => {
    if (nextPageToken) {
      setCurrentPage(prev => prev + 1);
      fetchChildren(nextPageToken, limit);
    }
  };

   // Note: Implementing previous page with cursor-based pagination requires storing previous cursors
   // or specific API support. For simplicity, the previous button will be disabled on the first page.

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-medium text-gray-800">Manage Children</h2>
              <p className="mt-1 text-sm text-gray-500">View and manage registered children</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 flex items-center justify-center w-full sm:w-auto"
                onClick={() => setShowAddModal(true)}
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add New Child
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
              placeholder="Search by name or User ID" // Updated placeholder
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
        </div>

        {/* Filters Panel (Placeholder) */}
        {showFilters && (
          <div className="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Add filter options relevant to children here */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by...</label>
                <select className="w-full border border-gray-300 rounded-md p-2">
                  <option>All</option>
                  {/* Add specific child filter options here (e.g., age group, health status) */}
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Apply Filters (Placeholder)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Children Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Birth Date
                  </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blood Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SSN
                  </th>
                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : !Array.isArray(filteredChildren) || filteredChildren.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No children found
                    </td>
                  </tr>
                ) : (
                  filteredChildren.map((child) => (
                    <tr key={child._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {/* Optional: Child avatar/icon */}
                           {/* <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={child.avatar || "/placeholder.svg"} alt="" />
                          </div> */}
                          <div className="text-sm font-medium text-gray-900">{child.name}</div>
                        </div>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {child.birthDate ? new Date(child.birthDate).toLocaleDateString() : 'N/A'}
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {child.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {child.bloodType}
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {child.ssn}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {child.userId}
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                           {/* View Certificate Button */}
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => {
                                if (child.birthCertificate) {
                                    window.open(child.birthCertificate, '_blank');
                                } else {
                                    alert('No birth certificate available for this child.');
                                }
                            }}
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               {/* Icon for viewing certificate (e.g., document or eye icon) */}
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 10.5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                           {/* Edit Button */}
                          <button
                             onClick={() => handleEditChild(child._id, child)} // Pass child data for editing
                             className="text-yellow-600 hover:text-yellow-900"
                           >
                             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {/* Icon for Edit */}
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                             </svg>
                           </button>
                           {/* Delete Button */}
                           <button
                             onClick={() => handleDeleteChild(child._id)} // Pass child ID for deleting
                             className="text-red-600 hover:text-red-900"
                           >
                             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               {/* Icon for Delete */}
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
                   {/* Previous Button */}
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
                   {/* Page numbers can be added here if API supports total pages or different pagination */}
                    {/* Next Button */}
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

      {/* Add Child Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4 p-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Add New Child</h2>
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
                const childData = {
                  name: formData.get('name'),
                  gender: formData.get('gender'),
                  bloodType: formData.get('bloodType'),
                  ssn: formData.get('ssn'),
                  birthCertificate: formData.get('birthCertificate') || null, // Optional image
                };
                // Get the date value from the input (YYYY-MM-DD string) and assign to birthDate
                const birthDateValue = formData.get('dateOfBirth');
                childData.birthDate = birthDateValue; // API expects 'birthDate' key

                handleAddChild(childData);
              }}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Child Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                 {/* Add fields for Gender, Blood Type, SSN, User ID */}
                  <div className="mb-4">
                   <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mb-4">
                   <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Type
                  </label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                 <div className="mb-4">
                   <label htmlFor="ssn" className="block text-sm font-medium text-gray-700 mb-1">
                    SSN
                  </label>
                  <input
                    type="text"
                    id="ssn"
                    name="ssn"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>

                 {/* Removed User ID field as it's not required by the API for adding */}

                {/* Optional Image Upload */}
                 <div className="mb-4">
                  <label htmlFor="birthCertificate" className="block text-sm font-medium text-gray-700 mb-1">
                    Birth Certificate (Optional File)
                  </label>
                  <input
                    type="file"
                    id="birthCertificate"
                    name="birthCertificate"
                    accept="image/*,application/pdf"
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
                   Add Child
                 </button>
               </div>
              </form>
            </div>
          </div>
        </div>
      )}

       {/* No Assign Modal for Children initially - replace or remove if not needed */}
       {/* If needed, create a separate modal for child-specific actions like assigning a nurse */}

    </div>
  );
}

export default ManageChildren; 