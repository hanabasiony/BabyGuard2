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
import EmailForForgotPass from './components/emailForForgotPass/EmailForForgotPass.jsx'
import VerifyResetCode from './components/verifyResetCode/verifyResetCode'
import PassReset from './components/ForgotPassChangePage/ForgotPassChangePage.jsx'
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
// import AdminPannel from './components/adminPanel/adminPannel'
import ProtectedRouteAdmin from './context/ProtectdRouteAdmin'
import Settings from './components/Settings/Settings'
import Review from './components/Review/Review'
import OrderConfirmation from './components/OrderConfirmation.jsx/OrderConfirmation'
import AddChild from './components/AddChild/AddChild'
import MyOrders from './components/MyOrders/MyOrders'
import { UserDataProvider } from './components/GetUserData/GetUserData'
import VaccinationForm from './components/VaccineReservation/VaccinationForm'
import OTPInput from './components/PaymentPage/otp'
import Dashboard from './components/Admin/Dashboard'
import ManageUsers from './components/Admin/ManageUsers'
import ManageNurses from './components/Admin/ManageNurses'
import Vaccinations from './components/Admin/Vaccinations'
import Appointments from './components/Admin/Appointments'
import ProductStore from './components/Admin/ProductStore'
import TipsArticles from './components/Admin/TipsArticles'
import Complaints from './components/Admin/Complaints'
import AdminDashboardLayout from './components/Admin/AdminDashboardLayout'
import PaymentForm from './components/PaymentPage/PaymentForm'
import ManageChildren from './components/Admin/ManageChildren'
import AddProductPage from './components/Admin/AddProductPage'
import AddProvider from './components/Admin/AddProvider'
import ManageCartStatus from './components/Admin/ManageCartStatus'
import WriteReview from './components/Admin/WriteReview'
import UserPage from './components/UserPage/UserPage'
import AddVaccine from './components/Admin/AddVaccine'
import ManageCarts from './components/ManageCarts/ManageCarts'
import CartDetails from './components/ManageCarts/CartDetails'
import ScrollToTop from './components/ScrollToTop'
import EditUsersById from './components/Admin/EditUserById/EditUserById'
import EditUser from './components/EditUser/EditUser'
import ManageProviders from './components/Admin/ManageProviders'
import NetworkStatus from './components/NetworkStatus'
import EditProviderById from './components/Admin/EditProviderById/EditProviderById'
import ChooseFromFour from './components/Admin/ChooseFromFour'
import AddPregnancyTips from './components/Admin/AddPregnancyTips'
import AddTrimester from './components/Admin/AddTrimester'
import AddRecommendedFoods from './components/Admin/AddRecommendedFoods.jsx'
import AddMilestone from './components/Admin/AddMilestone'
import ForgotPassChangePage from './components/ForgotPassChangePage/ForgotPassChangePage.jsx'

const router = createBrowserRouter([
  {
    path: '',
    element: (
      <>
        <ScrollToTop />
        <Layout />
      </>
    ),
    children: [
      { path: '', element: <RealHome /> },
      { path: 'login', element: <Login /> },
      { path: 'UpdatePass', element: <UpdateLoggedUserPassword /> },
      { path: 'Reg', element: <Reg /> },
      { path: 'settings', element: <Settings /> },
      { path: 'edit-user', element: <EditUser /> },
      { path: '*', element: <Notfound /> },
      {
        path: 'products',
        element: <Home />,
      },
      { path: 'categories', element: <Categories /> },
      { path: 'brands', element: <Brands /> },

      { path: 'email-forgot-pass', element: <EmailForForgotPass /> },
      { path: 'email-forgot-pass/verify-OTP/:email', element: <VerifyResetCode /> },
      { path: 'email-forgot-pass/verify-OTP/ForgotPassChangePage', element: <ForgotPassChangePage /> },

      { path: 'vacciens', element: <Vacciens /> },
      { path: '/VaccineReservation/:vaccineId', element:<ProtectedRoute> <VaccinationForm /></ProtectedRoute> },
      { path: 'payment', element: <PaymentPage /> },
      { path: 'otp', element: <OTPInput /> },
      // { path: 'Admin', element: <AdminDashboardLayout /> },





      {
        path: 'payment',
        element: (
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'PaymentForm',
        element: (
          <ProtectedRoute>
            <PaymentForm />
          </ProtectedRoute>
        ),
      },
      



      {
        path: 'order-confirmation',
        element: (
          <ProtectedRoute>
            <OrderConfirmation/>
          </ProtectedRoute>
        ),
      },
      {path:'user-page', element: <UserPage/> },
      
      {
        path: 'childProfile',
        element: (
          <ProtectedRoute>
            <ChildProfile />
          </ProtectedRoute>
        ),
      },
      {
        path:'change-password',
        element:<UpdateLoggedUserPassword/>
      },
      {
        path: 'myOrders',
        element: (
          <ProtectedRoute>
            <MyOrders/>
          </ProtectedRoute>
        ),
      },

      {
        path: 'review/:productId',
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
         
            <ProductDetails />
        
        ),
      },
      { path: 'add-child', element: <AddChild/> },
      { path: 'aboutUs', element: <AboutUs /> },
      { path: 'cart', element: <Cart /> },
    ],
  },
  {
    path: 'admin',
    element: (
      <>
        <ScrollToTop />
        <ProtectedRouteAdmin>
          <AdminDashboardLayout />
        </ProtectedRouteAdmin>
      </>
    ),
    children: [
      { path: '', element: <Dashboard /> },    
      { path: 'manage-users', element: <ManageUsers /> },
      { path: 'manage-nurses', element: <ManageNurses /> },
      { path: 'manage-children', element:<ManageChildren /> },
      { path: 'vaccinations', element: <Vaccinations /> },
      { path: 'appointments', element: <Appointments /> },
      { path: 'product-store', element: <ProductStore /> },
      { path: 'product-store/add', element: <AddProductPage /> },
      { path: 'tips-articles', element: <TipsArticles /> },
      { path: 'complaints', element: <Complaints /> },
      { path: 'manage-providers', element: <ManageProviders/> },
      { path: 'manage-providers/add-providers', element: <AddProvider/> },
      { path: 'manage-providers/edit-provider/:providerId', element: <EditProviderById/> },
      { path: 'cart-status', element: <ManageCartStatus/> },
      { path: 'vaccinations/add', element: <AddVaccine/> },
      { path: 'manage-carts' , element: <ManageCarts/> },
      { path: 'cart-details/:userId' , element: <CartDetails/> },
      { path: 'manage-users/edit-user/:userId' , element: <EditUsersById/> },
      { path: 'tips-articles/add-pregnancytips', element:<AddPregnancyTips/> },
      { path: 'tips-articles/add-trimeseter', element:<AddTrimester/>  },
      { path: 'tips-articles/add-recommended-food', element: <AddRecommendedFoods/>},
      { path: 'tips-articles/add-milestone', element:<AddMilestone/> },
      
      
    ],
  },
]);

const client = new QueryClient({
  defaultOptions:{
    // refetch
  }
})

export function App() {
  return (
    <UserDataProvider>
      <AuthcontextProvider>
        <CartContextProvider>
          <QueryClientProvider client={client}>
            <RouterProvider router={router} />
            
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
            <NetworkStatus/>
          </QueryClientProvider>
        </CartContextProvider>
      </AuthcontextProvider>
    </UserDataProvider>
  )
}