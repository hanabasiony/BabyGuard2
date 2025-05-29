import { Link } from "react-router-dom"

function Dashboard() {
  // This would be replaced with API data
  const stats = {
    totalUsers: { count: 2459, change: "+12.5%" },
    newAppointments: { count: 182, change: "+8.2%" },
    activeComplaints: { count: 48, change: "-2.4%" },
  }

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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
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
            <span className="text-green-500 font-medium">{stats.newAppointments.change}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.newAppointments.count}</h2>
          <p className="text-gray-500">New Appointments</p>
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
            <span className="text-red-500 font-medium">{stats.activeComplaints.change}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.activeComplaints.count}</h2>
          <p className="text-gray-500">Active Complaints</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/manage-nurses"
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
            Add & Remove Nurse
          </Link>

          <Link
            to="/vaccinations"
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
            Add & Remove Vaccine
          </Link>

          <Link
            to="/product-store"
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
            Add & Remove Product
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="p-4 border-b last:border-b-0 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-4 flex-shrink-0">
                <img src={activity.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-800 truncate">
                  <span className="font-medium">{activity.name}</span> {activity.action}
                </p>
                <p className="text-gray-500 text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
