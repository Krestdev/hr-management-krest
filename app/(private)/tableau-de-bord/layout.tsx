import DashboardLayout from '@/components/dashboard-layout'
import React from 'react'

function Layout({children}:{children:React.ReactNode}) {
  return <DashboardLayout>{children}</DashboardLayout>
}

export default Layout