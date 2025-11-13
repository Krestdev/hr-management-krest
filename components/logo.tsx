import { cn } from '@/lib/utils'
import React from 'react'

function Logo({className="", showIcon=true}:{className?:string; showIcon?:boolean}) {
  return (
    <div className={cn("flex items-center gap-4 uppercase tracking-[0.5em] font-medium text-gray-600 text-xl", className)}>
        { showIcon && <img src="/logo.svg" alt="logo" className="h-6 w-auto" />}
        {"kizuna"}
    </div>
  )
}

export default Logo