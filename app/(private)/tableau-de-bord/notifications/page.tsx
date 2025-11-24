'use client'
import Header from '@/components/header'
import { Notification02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import React from 'react'

function Page() {
  return (
    <div className="grid gap-4 sm:gap-6">
      <Header title="Notifications" variant={"primary"}/>
      <div className="card-1">
        <div className="card-1-header flex-row gap-2 items-center">
          <span className="card-1-icon bg-accent">
            <HugeiconsIcon icon={Notification02Icon} />
          </span>
          <h3>{"Liste des notifications"}</h3>
        </div>
      </div>
    </div>
  )
}

export default Page