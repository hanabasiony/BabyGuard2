import { useState } from 'preact/hooks'
import '@fortawesome/fontawesome-svg-core'
import '@fortawesome/react-fontawesome'

import './app.css'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Login from './components/login/Login';
import Notfound from './components/notfound/Notfound'
// import ProtectedRoute from './components/test/test'
import Reg from './components/Reg/Reg'
import Home from './components/home/home'
import Categories from './components/categories/categories'
// import Brands from './components/Brands'
import Brands from './components/Brands/Brands';
import AuthcontextProvider from './context/AuthContext'

// import Test from './components/test/test'

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PassSend from './components/PassSend/PassSend'
import VerifyResetCode from './components/verifyResetCode/verifyResetCode'
import PassReset from './components/PassReset/PassReset'
import UpdateLoggedUserPassword from './components/UpdateLoggedUserPassword/UpdateLoggedUserPassword'
import Vacciens from './components/Vacciens/Vacciens'
import PaymentPage from './components/PaymentPage/PaymentPage'
import ChildProfile from './components/ChildProfile/ChildProfile'
import PregnancyTips from './components/pregnancyTips/PregnancyTips'
import ContactUs from './components/ContactUs/ContactUs'
import ProductDetails from './components/ProductDetails/ProductDetails'
import AboutUs from './components/AboutUs/AboutUs'
// import CartContext from './context/CartContext'
import CartContextProvider from './context/CartContext'
import RealHome from './components/RealHome/RealHome'
import { Toaster } from 'react-hot-toast'
import Cart from './components/Cart/Cart'
import AdminPannel from './components/adminPanel/adminPannel'
import ProtectedRouteAdmin from './context/ProtectdRouteAdmin'
import Settings from './components/Settings/Settings'
import Review from './components/Review/Review'


const router = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      { path: '', element: <RealHome /> },
      { path: 'login', element: <Login /> },
      { path: 'UpdatePass', element: <UpdateLoggedUserPassword /> },
      { path: 'Reg', element: <Reg /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <Notfound /> },
      {
        path: 'products',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      { path: 'categories', element: <Categories /> },
      { path: 'brands', element: <Brands /> },
      { path: 'PassSend', element: <PassSend /> },
      { path: 'PassSend/VerifyResetCode', element: <VerifyResetCode /> },
      { path: 'PassSend/VerifyResetCode/PassReset', element: <PassReset /> },
      { path: 'vacciens', element: <Vacciens /> },
      {
        path: 'payment',
        element: (
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        ),
      },
      
      {
        path: 'childProfile',
        element: (
          <ProtectedRoute>
            <ChildProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'review',
        element: (
          <ProtectedRoute>
            <Review/>
          </ProtectedRoute>
        ),
      },
      { path: 'pregnancyTips', element: <PregnancyTips /> },
      { path: 'contactUs', element: <ContactUs /> },
      {
        path: 'productDetails/:id',
        element: (
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        ),
      },
      { path: 'aboutUs', element: <AboutUs /> },
      { path: 'cart', element: <Cart /> },
    ],
  },
  {
    path: 'adminPannel', element: <ProtectedRouteAdmin>
      <AdminPannel />
    </ProtectedRouteAdmin>,
  },
]);


// const adminRouter =createBrowserRouter([
//   {
//     path: '', element: <>  <Layout /> </>, children: [
//       { path: '', element: <AdminHome/> },
//     ]
//   }
// ])

const client = new QueryClient({
  defaultOptions:{
    // refetch
  }
})



export  function App() {

  return (
    <>
      <QueryClientProvider client={client}>
        <AuthcontextProvider>
          <CartContextProvider>

          <RouterProvider router={router} />
          {/* <AdminRouterProvider router={adminRouter} /> */}
          <Toaster 
           toastOptions={{
            className: '',
            style: {
              margin: '100px 0px 0px 0px ',
              position: 'absloute',
              zIndex: '999999',
              color: '#713200',
            },
          }}
          
          />

          </CartContextProvider>
        </AuthcontextProvider>
      </QueryClientProvider>
      
    </>
  )
}
