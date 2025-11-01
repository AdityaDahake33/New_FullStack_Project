import React from 'react'
import './index.css';
import { Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage.jsx'
import LoginPage from './Pages/LoginPage.jsx'
import SignupPage from './Pages/SignupPage.jsx'
import OnboardingPage from './Pages/OnboardingPage.jsx'
import NotificationPage from './Pages/NotificationPage.jsx'
import CallPage from './Pages/CallPage.jsx'
import ChatPage from './Pages/ChatPage.jsx'

import { Toaster, toast } from 'react-hot-toast'



const App = () => {
  return (
    <div className="h-screen" data-theme="dark">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/call" element={<CallPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>

        <Toaster />
    </div>
  )
}

export default App