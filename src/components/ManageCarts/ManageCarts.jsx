import React, { useState, useEffect } from "react";
import {
  User,
  Package,
  ArrowRight,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const ManageCarts = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderCountFilter, setOrderCountFilter] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCarts();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, statusFilter, orderCountFilter]);

  useEffect(() => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchQuery, statusFilter, orderCountFilter]);

  const fetchCarts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net//api/carts/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch carts");
      setLoading(false);
      console.error(err);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.user.fName.toLowerCase().includes(query) ||
          user.user.lName.toLowerCase().includes(query) ||
          user.user.email.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (user) => user.user.carts[0]?.status === statusFilter
      );
    }

    // Order count filter
    if (orderCountFilter !== "all") {
      filtered = filtered.filter((user) => {
        const orderCount = user.user.carts.length;
        switch (orderCountFilter) {
          case "1-2":
            return orderCount >= 1 && orderCount <= 2;
          case "3-5":
            return orderCount >= 3 && orderCount <= 5;
          case "5+":
            return orderCount > 5;
          default:
            return true;
        }
      });
    }

    setFilteredUsers(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  const handleUserClick = (userId) => {
    navigate(`/admin/cart-details/${userId}`);
  };

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start bg-white pt-10">
        {/* <div className="mt-40 shadow-lg rounded-full bg-white p-8"> */}
        <Oval
          height={80}
          width={80}
          color="#fda4af"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#f9a8d4"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
        {/* </div> */}
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 py-40 md:p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold mb-6">Users Orders Summary</h1>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm"
          />
        </div>

        {/* Order Count Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={orderCountFilter}
            onChange={(e) => setOrderCountFilter(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-rose-400 focus:border-rose-400 sm:text-sm"
          >
            <option value="all">All Orders</option>
            <option value="1-2">1-2 Orders</option>
            <option value="3-5">3-5 Orders</option>
            <option value="5+">5+ Orders</option>
          </select>
        </div>
      </div>

      {/* Results count and items per page */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="block w-20 pl-3 pr-8 py-1 text-sm border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-rose-400 focus:border-rose-400"
          >
            <option value="6">6</option>
            <option value="12">12</option>
            <option value="24">24</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getCurrentPageItems().map((userData) => (
          <div
            key={userData.user._id}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleUserClick(userData.user._id)}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-rose-100 p-2 rounded-full">
                <User className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {userData.user.fName} {userData.user.lName}
                </h2>
                <p className="text-sm text-gray-500">{userData.user.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{userData.user.phoneNumber}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Orders:</span>
                <span className="font-medium">
                  {userData.user.carts.length}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Latest Order:</span>
                <span className="font-medium">
                  #{userData.user.carts[0]?._id.slice(-6) || "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    userData.user.carts[0]?.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : userData.user.carts[0]?.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {userData.user.carts[0]?.status || "No Orders"}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex items-center justify-end text-rose-400 hover:text-rose-400">
              <span className="text-sm font-medium">View Details</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found matching your filters</p>
        </div>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {getPageNumbers().map((number) => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === number
                    ? "bg-rose-400 text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronsRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCarts;
