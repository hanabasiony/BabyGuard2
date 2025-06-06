import axios from "axios";
import { useEffect, useState } from "preact/hooks";
import { Link } from "react-router-dom"
import AddVaccine from './AddVaccine';

function Dashboard() {
  // This would be replaced with API data
  const stats = {
    totalUsers: { count: 2459, change: "+12.5%" },
    newAppointments: { count: 182, change: "+8.2%" },
    activeComplaints: { count: 48, change: "-2.4%" },
  }
  const [appointmentsNumber, setAppointmentsNumber] = useState([]);
  const [showAddVaccineModal, setShowAddVaccineModal] = useState(false);
  const [showAddNurseModal, setShowAddNurseModal] = useState(false);
  const [complaintsNumber, setComplaintsNumber] = useState([]);

  // This would be replaced with API data
  const recentActivity = [
    {
      id: 1,
      name: "Sarah Johnson",
      action: "scheduled a vaccination",
      time: "2 hours ago",
      avatar: "/placeholder.svg",
    },
    { id: 2, name: "Dr. Mike", action: "added new vaccine schedule", time: "4 hours ago", avatar: "/placeholder.svg" },
    { id: 3, name: "Emma", action: "submitted a new complaint", time: "6 hours ago", avatar: "/placeholder.svg" },
  ]

  const fetchAppointments = async () => {
    // setIsLoading(true);
    try {
      const token = localStorage.getItem('token'); // Assuming token is needed for admin API
      if (!token) {
          console.error('Authentication token not found for admin API');
          // setIsLoading(false);
          // Optionally navigate to login or show an error message
          return;
      }
      
      const response = await axios.get('http://localhost:8000/api/vaccine-requests/admin', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      
      if (response.data && response.data.data) {
        setAppointmentsNumber(response.data.data.length);
        console.log(response.data.data.length);
      } else {
        console.error('API returned unexpected data structure:', response.data);
        
      }
      
    } catch (error) {
      console.error('Error fetching appointments:', error.response?.data || error.message);
      // setRawAppointments([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComplains = async () => {
    // setIsLoading(true);
    try {
      const token = localStorage.getItem('token'); // Assuming token is needed for admin API
      if (!token) {
          console.error('Authentication token not found for admin API');
          // setIsLoading(false);
          // Optionally navigate to login or show an error message
          return;
      }
      
      const response = await axios.get('http://localhost:8000/api/complaints/admin', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      
      if (response.data && response.data.data) {
        setComplaintsNumber(response.data.data.length);
        console.log(response.data.data.length);
      } else {
        console.error('API returned unexpected data structure:', response.data);
        
      }
      
    } catch (error) {
      console.error('Error fetching appointments:', error.response?.data || error.message);
      // setRawAppointments([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    fetchComplains();
  }, []);

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
      if (!nurseData.phone) {
        alert('Phone number is required');
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

      // Prepare the request body
      const requestBody = {
        fName: nurseData.fName.trim(),
        lName: nurseData.lName.trim(),
        email: nurseData.email.trim(),
        phone: nurseData.phone.trim(),
        hospitalName: nurseData.hospital.trim()
      };

      // Make API call
      const response = await axios.post('http://localhost:8000/api/nurse', requestBody, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        // Fetch updated nurses list
        const nursesResponse = await axios.get('http://localhost:8000/api/nurse', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (nursesResponse.data && nursesResponse.data.data) {
          // Update the nurses list in the ManageNurses component
          const event = new CustomEvent('nursesUpdated', { 
            detail: { nurses: nursesResponse.data.data } 
          });
          window.dispatchEvent(event);
        }

        setShowAddNurseModal(false);
        alert('Nurse added successfully!');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          alert('Email or phone number already exists');
        } else if (error.response.status === 400) {
          const errorMessage = error.response.data.message || 'Validation failed. Please check your input.';
          alert(`Validation Error: ${errorMessage}`);
        } else if (error.response.status === 401) {
          alert('Authentication failed. Please log in again.');
        } else {
          alert(error.response.data.message || 'Error adding nurse');
        }
      } else if (error.request) {
        alert('No response received from server. Please check your connection.');
      } else {
        alert('Error setting up the request: ' + error.message);
      }
      console.error('Full error object:', error);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, Admin!</p>
        </div>
        <div className="flex items-center mt-4 sm:mt-0">
          <button className="mr-4 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
             
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <span className="text-green-500 font-medium">{stats.totalUsers.change}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalUsers.count.toLocaleString()}</h2>
          <p className="text-gray-500">Total Users</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
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
            <span className="text-green-500 font-medium"></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{appointmentsNumber ? appointmentsNumber : 'Loading...'}</h2>
          <p className="text-gray-500">Total Appointments</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            {/* <span className="text-red-500 font-medium">{stats.activeComplaints.change}</span> */}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{complaintsNumber}</h2>
          <p className="text-gray-500">Active Complaints</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setShowAddNurseModal(true)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-4 rounded-md flex items-center justify-center hover:from-pink-600 hover:to-pink-700 transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Add Nurse
          </button>

          <button
            onClick={() => setShowAddVaccineModal(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-md flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Add Vaccine
          </button>

          <Link
            to="product-store/add"
            state={{ showAddModal: true }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-md flex items-center justify-center hover:from-purple-600 hover:to-purple-700 transition duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Add Product
          </Link>
        </div>
      </div>

      {/* Add Vaccine Modal */}
      {showAddVaccineModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Add New Vaccine</h2>
              <button 
                onClick={() => setShowAddVaccineModal(false)} 
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AddVaccine onSuccess={() => {
              setShowAddVaccineModal(false);
            }} />
          </div>
        </div>
      )}

      {/* Add Nurse Modal */}
      {showAddNurseModal && (
        <div className="fixed inset-0 bg-gray-600/30 bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-full overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4 p-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Add New Nurse</h2>
              <button onClick={() => setShowAddNurseModal(false)} className="text-gray-400 hover:text-gray-500">
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
                  hospital: formData.get('hospital')
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
                    placeholder="Enter first name"
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
                    placeholder="Enter last name"
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
                    placeholder="Enter email address"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Enter phone number"
                  />
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
                    placeholder="Enter hospital name"
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddNurseModal(false)}
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
    </div>
  )
}

export default Dashboard
