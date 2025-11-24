'use client'
import { cn } from '@/lib/utils'
import { Notification } from '@/types/types'
import { CalendarUserIcon, Delete03Icon, InformationSquareIcon, LocationUser04Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react'
import React from 'react'
import { Button } from './ui/button'
import { formatRelative } from 'date-fns'
import { fr } from 'date-fns/locale'

function NotificationItem({id,status, statusType, type="DEFAULT", description, createdAt}:Notification) {

  const getIcon = (value:Notification["type"]):IconSvgElement => {
    switch(value){
      case "DEFAULT":
        return InformationSquareIcon;
      case "IS_AWAY":
        return LocationUser04Icon;
      case "LEAVE_REQUEST":
        return CalendarUserIcon;
        default : return InformationSquareIcon;
    }
  };

  const iconStyle = (type:Notification["statusType"]):string =>{
    switch(type){
      case "info":
        return "bg-blue-100 text-blue-600";
      case "error":
        return "bg-red-100 text-red-600";
      case "success":
        return "bg-green-100 text-green-600";
      case "warning":
        return "bg-amber-100 text-amber-600";
      default : return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className={cn(
      "px-4 py-2 flex flex-col gap-2 items-center transition-all duration-200 ease-out group", 
      status === "UNREAD" ? "bg-white hover:bg-neutral-50" :
      "bg-neutral-100")}>
      <div className="flex justify-between gap-3 items-center">
        <div className="flex items-center gap-2">
          <span className={cn("size-8 flex items-center justify-center", iconStyle(statusType))}>
            <HugeiconsIcon icon={getIcon(type)} size={20}/>
          </span>
          <p className="text-slate-600 text-sm">{description}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-xs">{formatRelative(new Date(createdAt), new Date(), {locale: fr})}</span>
          <Button onClick={()=>console.log(id)} 
          size={"icon-sm"} 
          variant={"destructive"}>
            <HugeiconsIcon icon={Delete03Icon} size={16}/>
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Button size={"sm"} variant={"default"}>{"Marquer comme lu"}</Button>
      </div>
    </div>
  )
}

export default NotificationItem