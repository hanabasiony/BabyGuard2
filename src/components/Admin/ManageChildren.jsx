import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


function ManageChildren() {
  // State for children data
  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null); // For edit/details modal
  const [showFilters, setShowFilters] = useState(false); // Placeholder
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Placeholder, depends on API
  const [totalEntries, setTotalEntries] = useState(0); // Placeholder, depends on API
  const [startIndex, setStartIndex] = useState(1);
  const [endIndex, setEndIndex] = useState(0);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [limit, setLimit] = useState(10);
  const [prevPageToken, setPrevPageToken] = useState(null);
  const [pageHistory, setPageHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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
        toast.error('Authentication token is missing. Please log in again.');
        setIsLoading(false);
        return;
      }

      const apiUrl = new URL('http://localhost:8000/api/child/admin');
      if (cursor) {
        apiUrl.searchParams.append('cursor', cursor);
      }
      apiUrl.searchParams.append('limit', limit);

      const response = await axios.get(apiUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const childrenData = Array.isArray(response.data.data) ? response.data.data : [];
      setChildren(childrenData);
      setFilteredChildren(childrenData);
      setNextPageToken(response.data.nextCursor || null);
      setPrevPageToken(cursor || null);
      setTotalEntries(response.data.totalEntries || 0);

      // Update page history
      if (cursor) {
        setPageHistory(prev => [...prev, cursor]);
      }

      const currentStartIndex = (currentPage - 1) * limit + 1;
      const currentEndIndex = Math.min(currentStartIndex + childrenData.length - 1, response.data.totalEntries || 0);
      setStartIndex(currentStartIndex);
      setEndIndex(currentEndIndex);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching children:', error);
      setError('Failed to fetch children data');
      setChildren([]);
      setFilteredChildren([]);
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

  // Handle edit child (Placeholder)
  // const handleEditChild = async (childId, updatedData) => {
  //   console.log('Editing child:', childId, updatedData);
  //   // Implement API call to edit child
  //   toast.error('Edit functionality not yet implemented');
  // };

  // Handle delete child
  const handleDeleteChild = async (childId) => {
    // Show confirmation toast
    const confirmDelete = await new Promise((resolve) => {
      toast.custom((t) => (
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
          <p className="mb-4 text-gray-800">Are you sure you want to delete this child?</p>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-pink-400 text-white rounded hover:bg-pink-500"
              onClick={async () => {
                toast.dismiss(t.id);
                // Immediately remove from UI
                setChildren(prevChildren => prevChildren.filter(child => child._id !== childId));
                setFilteredChildren(prevChildren => prevChildren.filter(child => child._id !== childId));
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
      ), {
        duration: Infinity,
        position: 'top-center',
      });
    });

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token is missing. Please log in again.');
        return;
      }

      // Make the API call in the background
      const response = await axios.delete(`http://localhost:8000/api/child/${childId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.status === 200 || response.status === 204) {
        toast.success('Child deleted successfully!');
            console.log(response)
      } else {
        // If the API call fails, revert the UI changes
        fetchChildren(null, limit);
        toast.error('Failed to delete child. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting child:', error);
      // If there's an error, revert the UI changes
      fetchChildren(null, limit);
      if (error.response) {
        toast.error(error.response.data.message || `Error deleting child: ${error.response.status}`);
      } else {
        toast.error('Error connecting to server');
      }
    }
  };

  // Handle assign/view details for child (Placeholder)
  const handleChildAction = (child) => {
      console.log('Performing action on child:', child);
      toast.error('Action functionality not yet implemented');
  };

  // Handle next page
  const handleNextPage = () => {
    if (nextPageToken) {
      setCurrentPage(prev => prev + 1);
      fetchChildren(nextPageToken, limit);
    }
  };

  // Handle previous page
  const handlePrevPage = () => {
    if (pageHistory.length > 0) {
      const prevCursor = pageHistory[pageHistory.length - 2] || null;
      setPageHistory(prev => prev.slice(0, -1));
      setCurrentPage(prev => prev - 1);
      fetchChildren(prevCursor, limit);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/35 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-medium text-gray-800">Manage Children</h2>
              <p className="mt-1 text-sm text-gray-500">View and manage registered children</p>
            </div>
             {/* Button to open Add Child modal */}
            <button
              onClick={() => navigate('/admin/add-child')}
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <PlusCircle className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add New Child
            </button>
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
              placeholder="Search by name or User ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

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
                                    toast.error('No birth certificate available for this child.');
                                }
                            }}
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </button>
                           {/* Edit Button */}
                          {/* <button
                             onClick={() => handleEditChild(child._id, child)} // Pass child data for editing
                             className="text-yellow-600 hover:text-yellow-900"
                           >
                             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {/* Icon for Edit */}
                                {/* <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                             </svg>
                           </button> */}
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

        
      </div>
    </div>
  );
}

export default ManageChildren; 