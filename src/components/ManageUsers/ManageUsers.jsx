import { Search, Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react"

export default function ManageUsers() {
  const users = [
    {
      id: 1,
      parentName: "Emma Johnson",
      email: "emma@example.com",
      babyName: "Liam",
      birthDate: "05/12/2022",
      status: "normal",
    },
    {
      id: 2,
      parentName: "John Smith",
      email: "john@example.com",
      babyName: "Olivia",
      birthDate: "08/25/2021",
      status: "normal",
    },
    {
      id: 3,
      parentName: "Mary Williams",
      email: "mary@example.com",
      babyName: "Isabella",
      birthDate: "02/17/2023",
      status: "certificate",
    },
    {
      id: 4,
      parentName: "James Brown",
      email: "james@example.com",
      babyName: "Benjamin",
      birthDate: "11/30/2022",
      status: "download",
    },
  ]

  return (
    <div className="p-6 md:pl-72 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-900 mb-4 md:mb-0 text-center w-full md:text-left">Manage Users</h1>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-full w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="hidden md:block ml-4">
          <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
            <div
              className="w-6 h-6 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/placeholder.svg?height=24&width=24')" }}
            ></div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Parent Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Baby Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Baby Date of Birth</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Certificates</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{user.parentName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.babyName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.birthDate}</td>
                <td className="px-6 py-4 text-sm text-gray-900">


                  <div className="flex space-x-2 ">
                    <button className="p-1 text-blue-500 hover:text-blue-700">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="p-1 ms-5 text-red-500 hover:text-red-700">
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>


                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
                      Upload Certificate
                    </button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <nav className="flex items-center space-x-2">
          <button className="p-2 rounded-md text-gray-500 hover:bg-blue-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="px-4 py-2 rounded-md bg-blue-100 text-blue-800 font-medium">1</button>
          <button className="p-2 rounded-md text-gray-500 hover:bg-blue-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  )
}
