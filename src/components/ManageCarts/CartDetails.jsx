import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Calendar,
  ArrowLeft,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const CartDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredCarts, setFilteredCarts] = useState([]);
  const [updatingStatuses, setUpdatingStatuses] = useState({});

  const statusOptions = [
    { value: "Pending", label: "Pending", color: "yellow" },
    { value: "Online paid", label: "Online Paid", color: "blue" },
    {
      value: "Waiting for cash payment",
      label: "Waiting for Cash",
      color: "orange",
    },
    { value: "Delivered", label: "Delivered", color: "green" },
    // { value: 'Cancelled', label: 'Cancelled', color: 'red' }
  ];

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (userData) {
      filterCarts();
    }
  }, [userData, searchQuery, statusFilter]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/carts/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const user = response.data.data.find((u) => u.user._id === userId);
      setUserData(user);
      setFilteredCarts(user?.user.carts || []);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch user data");
      setLoading(false);
      console.error(err);
    }
  };

  const filterCarts = () => {
    if (!userData) return;

    let filtered = [...userData.user.carts];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cart) =>
          cart._id.toLowerCase().includes(query) ||
          cart.street.toLowerCase().includes(query) ||
          cart.city.toLowerCase().includes(query) ||
          cart.governorate.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((cart) => cart.status === statusFilter);
    }

    setFilteredCarts(filtered);
  };

  const handleStatusChange = async (cartId, newStatus) => {
    try {
      // Set loading state for this specific cart
      setUpdatingStatuses((prev) => ({ ...prev, [cartId]: true }));

      const token = localStorage.getItem("token");
      await axios.patch(
        `https://baby-guard-h4hngkauhzawa6he.southafricanorth-01.azurewebsites.net/api/carts/status/admin/${cartId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setUserData((prevData) => ({
        ...prevData,
        user: {
          ...prevData.user,
          carts: prevData.user.carts.map((cart) =>
            cart._id === cartId ? { ...cart, status: newStatus } : cart
          ),
        },
      }));

      toast.success(
        `Order #${cartId.slice(-6)} status updated to ${newStatus}`
      );
    } catch (err) {
      toast.error(`Failed to update status for order #${cartId.slice(-6)}`);
      console.error(err);
    } finally {
      // Clear loading state for this specific cart
      setUpdatingStatuses((prev) => ({ ...prev, [cartId]: false }));
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(
      (option) => option.value === status
    );
    if (!statusOption) return "gray";

    switch (statusOption.color) {
      case "yellow":
        return "bg-yellow-50/50 text-yellow-800";
      case "blue":
        return "bg-blue-50/50 text-blue-800";
      case "orange":
        return "bg-orange-50/50 text-orange-800";
      case "green":
        return "bg-green-50/50 text-green-800";
      case "red":
        return "bg-red-50/50 text-red-800";
      default:
        return "bg-gray-50/50 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start bg-white pt-10">
        <Oval
          height={80}
          width={80}
          color="#ec4899"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#f9a8d4"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-semibold text-gray-800">User not found</h2>
        <button
          onClick={() => navigate("/admin/manage-carts")}
          className="mt-4 text-pink-500 hover:text-pink-600"
        >
          Go back to users list
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 py-40 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Back Button and User Info */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/admin/manage-carts")}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Users
        </button>
      </div>

      {/* User Information Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-pink-100 p-3 rounded-full">
            <User className="w-8 h-8 text-pink-500" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">
              {userData.user.fName} {userData.user.lName}
            </h2>
            <p className="text-gray-600">{userData.user.email}</p>
            <p className="text-gray-600">{userData.user.phoneNumber}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by order ID or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Online paid">Online Paid</option>
            <option value="Waiting for cash payment">Waiting for Cash</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600 mb-4">
        Showing {filteredCarts.length} of {userData.user.carts.length} orders
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Order History</h3>
        {filteredCarts.map((cart) => (
          <div key={cart._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-pink-500" />
                  <span className="font-medium">
                    Order #{cart._id.slice(-6)}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(cart.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {updatingStatuses[cart._id] ? (
                    <div className="px-3 py-1">
                      <Oval
                        height={20}
                        width={20}
                        color="#ec4899"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel="oval-loading"
                        secondaryColor="#f9a8d4"
                        strokeWidth={2}
                        strokeWidthSecondary={2}
                      />
                    </div>
                  ) : (
                    <>
                      <select
                        value={cart.status}
                        onChange={(e) =>
                          handleStatusChange(cart._id, e.target.value)
                        }
                        className={`appearance-none px-3 py-1 rounded-full text-sm pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500 ${getStatusColor(
                          cart.status
                        )}`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-pink-500" />
                  <span>
                    {cart.street}, {cart.city}, {cart.governorate}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-pink-500" />
                  <span>Payment: {cart.paymentType}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p>Products Count: {cart.productsCount}</p>
                <p className="font-semibold">Total Price: ${cart.totalPrice}</p>
              </div>
            </div>

            {/* Products List */}
            <div className="mt-4 border-t pt-4">
              <h4 className="font-medium mb-3">Products:</h4>
              <div className="space-y-3">
                {cart.products.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center space-x-4 bg-gray-50 p-3 rounded"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        Age: {product.requiredAge} • Quantity:{" "}
                        {product.quantity} • Price: ${product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* No Results Message */}
        {filteredCarts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No orders found matching your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDetails;
