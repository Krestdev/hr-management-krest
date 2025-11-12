import { Loader2 } from 'lucide-react'
import React from 'react'

function PageLoader() {
  return (
    <div className='w-full min-h-dvh flex items-center justify-center gap-2'><Loader2 size={24} className='animate-spin'/><span>{"Chargement des fonctionnalités"}</span></div>
  )
}

export default PageLoader