import React from 'react'
import AdminSidebar from '../AdminSidebar/AdminSidebar'
// import AdminDashBoard from '../ManageUsers/AdminDashBoard'
import ManageUsers from '../ManageUsers/ManageUsers'

export default function AdminPannel() {
    return (
        <>
            <AdminSidebar/>
            <ManageUsers/>
        </>
    )
}
