import Commonbar from '@/components/Commonbar';
import Footer from '@/components/Footer';
import Header from '@/components/Header'
import AdminProtectedRoute from '@/components/ProtectedRoute'
import React from 'react'

const admin = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <AdminProtectedRoute>
        <Commonbar/>
        <Header />
        {children}
        <Footer/>
      </AdminProtectedRoute>

    </div>
  )
}

export default admin