'use client'
import { Payslip } from '@/types/types'
import { Attachment01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

function PaySlipCard({month, year, fileUrl}:Payslip) {
    const date = new Date(year, month - 1, 1);
  return (
    <div className="relative overflow-hidden rounded-lg p-4 flex flex-col gap-2 border border-white bg-neutral-50 shadow-sm">
        <span className="z-10 w-fit px-2 py-0.5 rounded-sm bg-neutral-100 text-neutral-500 text-xs tracking-wider uppercase">{"Bulletin de paie"}</span>
        <div className="z-10 flex gap-2 items-center">
            <span className="size-8 rounded-lg flex items-center justify-center bg-primary-100 text-primary-700">
                <HugeiconsIcon icon={Attachment01Icon} size={20} />
            </span>
            <p className="text-[clamp(18px,2.5vw,20px)] font-semibold tracking-tight first-letter:uppercase">{format(date, "MMMM yyyy", {locale: fr})}</p>
        </div>
        <Link href={fileUrl} className="z-10" target="_blank">
            <Button variant={"primary"} size={"sm"}>{"Télécharger"}</Button>
        </Link>
        <img src={"/images/files.svg"} alt="files" className="absolute -bottom-1/2 right-3" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full h-1/2 rounded-full bg-white blur-xl" />
    </div>
  )
}

export default PaySlipCard