import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { MoreHorizontalIcon } from '@hugeicons/core-free-icons';


const cardVariants = cva(
  "w-full p-5 flex flex-col gap-2 border bg-linear-to-t rounded-lg",
  {
    variants:{
      variant: {
       primary: "from-primary-400 to-primary-700 text-white border-primary-400",
       default: "from-gray-50 to-gray-200 text-gray-900 border-gray-200",
       dark: "from-neutral-700 to-neutral-900 text-white border-neutral-700",
       grey: "from-[#878887] to-[#4D5766] text-white border-[#878887]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

interface Props {
  className?: string;
  children?: React.ReactNode;
  title: string;
  value: number | string;
  advanced?: {title?: string; value:string | number}
}

function StatisticCard({className, variant, title, children, value, advanced}:Props & VariantProps<typeof cardVariants>) {
  return (
    <div className={cn(cardVariants({variant, className}))}>
      <div className="w-full flex items-center gap-2 justify-between">
        <span className={cn("text-sm leading-[150%] font-medium", !!variant ? "text-gray-200" : "text-gray-700")}>{title}</span>
        {
          children &&
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"}>
                <HugeiconsIcon icon={MoreHorizontalIcon}/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {children}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </div>
      <span className="text-[32px] leading-[120%] tracking-[-2%] font-medium">{value}</span>
      {
        advanced && 
        <>
        <hr className={cn("w-full", !variant ? "border-neutral-200" : variant==="dark" ? "border-neutral-500" : variant === "grey" ? "border-neutral-400" :"border-primary-200")}/>
        <p className={cn("text-[12px] leading-[150%]", !!variant ? "text-gray-200" : "text-gray-700")}>
          {advanced.title && `${advanced.title}: `}<strong>{advanced.value}</strong>
        </p>
        </>
      }
    </div>
  )
}

export default StatisticCard