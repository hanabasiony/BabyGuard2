import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRouteAdmin({children}) {
    // Check if user is authenticated and is an admin
    if (localStorage.getItem('token') === null || localStorage.getItem('role') !== 'admin') {
        // If not admin or not authenticated, redirect to login
        return <Navigate to='/login' replace />
    }

    // If user is admin, render the protected content
    return children;
}

