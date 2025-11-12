'use client'
import { Toaster } from '@/components/ui/sonner'
import React from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      staleTime: 5000,
    },
  },
});

function Providers({children}:{children:React.ReactNode}) {
  return (
    <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-center"/>
    </QueryClientProvider>
  )
}

export default Providers