
import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

export default function ProtectedRouteAdmin({children}) {
    const navigate = useNavigate();

    // Redirect if either token is missing OR role is not 'parent'
    if(localStorage.getItem('token') === null || localStorage.getItem('role') !== 'admin'){
        return <Navigate to='/login' />
    }

    return (
        <>
            {children}
        </>
    )
}

