import React, { useState } from 'react';
// import { Menu, X, Home, Users, CalendarDays, Store, FileText, LogOut, Syringe } from 'lucide-react';
import { LayoutDashboard, Users, UserRound, Syringe, Calendar, ShoppingBag, BookOpen, LogOut, Menu } from 'lucide-react'

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button className="fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-100 md:hidden" onClick={toggleSidebar}>
        <Menu className="h-6 w-6 text-blue-900" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-blue-50 overflow-y-auto`}
      >
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-200 rounded-full p-2 w-10 h-10 flex items-center justify-center">
              <div
                className="w-6 h-6 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/placeholder.svg?height=24&width=24')" }}
              ></div>
            </div>
            <span className="text-xl font-bold text-blue-900">Baby Guard</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <NavItem icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" />
            <NavItem icon={<Users className="h-5 w-5" />} label="Manage Users" active />
            <NavItem icon={<UserRound className="h-5 w-5" />} label="Manage Nurses" />
            <NavItem icon={<Syringe className="h-5 w-5" />} label="Manage Vaccinations" />
            <NavItem icon={<Calendar className="h-5 w-5" />} label="Appointment Requests" />
            <NavItem icon={<ShoppingBag className="h-5 w-5" />} label="Product Store" />
            <NavItem icon={<BookOpen className="h-5 w-5" />} label="Tips & Articles & Suggestions" />
            <div className="pt-6">
              <NavItem icon={<LogOut className="h-5 w-5" />} label="Logout" />
            </div>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={toggleSidebar}></div>}
    </>
  )
}

function NavItem({ icon, label, active = false }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors ${
        active ? "bg-blue-100 text-blue-900" : "text-blue-800 hover:bg-blue-100 hover:text-blue-900"
      }`}
    >
      <span className="text-blue-600">{icon}</span>
      <span>{label}</span>
    </a>
  )
};

export default AdminSidebar;
