import axios from "axios";
import { useEffect, useState } from "preact/hooks";
import { Link } from "react-router-dom";
import { Oval } from "react-loader-spinner";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentsNumber, setAppointmentsNumber] = useState(null);
  const [complaintsNumber, setComplaintsNumber] = useState(null);
  const [usersNumber, setUsersNumber] = useState(null);

  const token = localStorage.getItem("token");

  const fetchAppointments = async () => {
    try {
      if (!token) {
        console.error("Authentication token not found for admin API");
        setAppointmentsNumber(0);
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
        setAppointmentsNumber(response.data.data.length);
      } else {
        setAppointmentsNumber(0);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.response?.data || error.message);
      setAppointmentsNumber(0);
    }
  };

  const fetchComplains = async () => {
    try {
      if (!token) {
        console.error("Authentication token not found for admin API");
        setComplaintsNumber(0);
        return;
      }

      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/complaints/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data) {
        setComplaintsNumber(response.data.data.length);
      } else {
        setComplaintsNumber(0);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error.response?.data || error.message);
      setComplaintsNumber(0);
    }
  };

  const fetchUsersNumbers = async () => {
    try {
      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.users) {
        setUsersNumber(response.data.users.length);
      } else {
        setUsersNumber(0);
      }
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
      setUsersNumber(0);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchAppointments(),
          fetchComplains(),
          fetchUsersNumbers()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Oval
          height={80}
          width={80}
          color="#fda4af"
          secondaryColor="#fecdd3"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Dashboard Overview
          </h1>
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
            ></svg>
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
                className="h-6 w-6"
                style={{ color: '#8BCFE0' }}
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
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {usersNumber || 0}
          </h2>
          <p className="text-gray-500">Total Users</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-rose-100 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                style={{ color: '#F5C2C7' }}
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
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {appointmentsNumber || 0}
          </h2>
          <p className="text-gray-500">Total Appointments</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="bg-gray-100 p-3 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
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
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {complaintsNumber || 0}
          </h2>
          <p className="text-gray-500">Active Complaints</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/manage-nurses"
            className="bg-rose-300 text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-rose-400 transition duration-200"
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
          </Link>

          <Link
            to="/admin/vaccinations/add"
            state={{ showAddModal: true }}
            className="bg-[#8BCFE0] text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-[#7ABFD0] transition duration-200"
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
          </Link>

          <Link
            to="product-store/add"
            state={{ showAddModal: true }}
            className="bg-gradient-to-r from-gray-500 to-gray-500 text-white py-3 px-4 rounded-md flex items-center justify-center hover:from-gray-600 hover:to-gray-600 transition duration-200"
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
    </div>
  );
}

export default Dashboard;
