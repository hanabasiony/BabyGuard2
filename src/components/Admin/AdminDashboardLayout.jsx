import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import ManageUsers from './ManageUsers';
import ManageNurses from './ManageNurses';
import Vaccinations from './Vaccinations';
import Appointments from './Appointments';
import ProductStore from './ProductStore';
import TipsArticles from './TipsArticles';
import Complaints from './Complaints';
import ManageChildren from './ManageChildren';
import AddProductPage from './AddProductPage';
import AddProvider from './AddProvider';
import AddVaccine from './AddVaccine';
import ManageCartStatus from './ManageCartStatus';
import ManageCarts from '../ManageCarts/ManageCarts';
import CartDetails from '../ManageCarts/CartDetails';
import EditUsersById from './EditUserById/EditUserById';

const AdminDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-y-hidden">
      {/* Mobile menu button */}
      {/* <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button> */}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0 transition duration-200 ease-in-out z-40`}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 ms-6 lg:ms-0 flex flex-col overflow-hidden overflow-y-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="manage-users" element={<ManageUsers />} />
              <Route path="manage-nurses" element={<ManageNurses />} />
              <Route path="/manage-children" element={<ManageChildren />} />
              <Route path="vaccinations" element={<Vaccinations />} />
              <Route path="vaccinations/add" element={<AddVaccine />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="product-store" element={<ProductStore />} />
              <Route path="product-store/add" element={<AddProductPage />} />
              <Route path="tips-articles" element={<TipsArticles />} />
              <Route path="complaints" element={<Complaints />} />
              <Route path="providers" element={<AddProvider />} />
              <Route path="cart-status" element={<ManageCartStatus />} />
              <Route path='manage-carts' element={<ManageCarts/> }/>
              <Route path='cart-details/:userId' element={<CartDetails/> }/>
              <Route path='manage-users/edit-user/:userId' element={<EditUsersById/> }/>
            </Routes>
          </div>
        </main>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboardLayout; 