import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './navbar/Navbar'
import Footer from './Footer'

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout