import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

export default function ProtectedRoute({children}) {

    const navigate = useNavigate();

    if( localStorage.getItem('token') == null || localStorage.getItem('role') !== 'parent'){
        return <Navigate to='/login' />
    }

  return (
    <>
    {children}
    </>
  )
}