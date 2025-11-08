import React from 'react'
import './index.css';
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './Pages/HomePage.jsx'
import LoginPage from './Pages/LoginPage.jsx'
import SignupPage from './Pages/SignupPage.jsx'
import OnboardingPage from './Pages/OnboardingPage.jsx'
import NotificationPage from './Pages/NotificationPage.jsx'
import CallPage from './Pages/CallPage.jsx'
import ChatPage from './Pages/ChatPage.jsx'
import axios from 'axios'
import { axiosInstance } from './lib/axios.js'

import { Toaster, toast } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import PageLoader from './components/PageLoader.jsx'
import { getAuthUser } from './lib/api.js';



 const App = () => {

  const { isLoading, data } = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
    retry: false,
  });

  const authUser = data?.user;
  const isAuthentication = Boolean(authUser)
  const isOnBoarded = authUser?.isOnboarded

  if (isLoading) return <PageLoader />

   return (
     <div className="h-screen" data-theme="dark">
         <Routes>
           <Route path="/"
            element={
              isAuthentication && isOnBoarded ? (
              <HomePage />
            ) : <Navigate to={isAuthentication ? "/onboarding" : "/login"} />
            } />
           <Route path="/login" element={!isAuthentication ? <LoginPage /> : <Navigate to="/" />} />
           <Route path="/signup" element={!isAuthentication ? <SignupPage /> : <Navigate to="/" />} />
           <Route path="/onboarding" element={
             isAuthentication ? (
               !isOnBoarded ? (
                 <OnboardingPage />
               ) : (
                 <Navigate to="/" />
               )
             ) : (
               <Navigate to="/login" />
             )
           } />
           <Route path="/notifications" element={isAuthentication ? <NotificationPage /> : <Navigate to="/login" />} />
           <Route path="/call" element={isAuthentication ? <CallPage /> : <Navigate to="/login" />} />
           <Route path="/chat" element={isAuthentication ? <ChatPage /> : <Navigate to="/login" />} />
        </Routes>

         <Toaster />
     </div>
   )
 }

 export default App