'use client'
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { HolidayRequest } from '@/types/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarDays, Clock, FileText, Info, Paperclip } from 'lucide-react';
import React from 'react'
import { badgeStatusVariant, formatStatusLabel } from './page';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar01Icon, DateTimeIcon, InformationCircleIcon, Message01Icon, OfficeChairIcon } from '@hugeicons/core-free-icons';

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  request: HolidayRequest;
};

function ViewLeaveRequest({isOpen, openChange, request}:Props) {
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{"Demande d'absence"}</DialogTitle>
                <DialogDescription>{"Détails de la demande"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-3">
            {/* Type */}
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={OfficeChairIcon} className="text-muted-foreground" size={20}/>
            <span className="text-sm">
              {request.typeLabel}
            </span>
          </div>
          {/* Statut */}
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={InformationCircleIcon} className="text-muted-foreground" size={20} />
            <span className="text-sm">{"Statut:"}</span>
            <Badge variant={badgeStatusVariant(request.status)}>
              {formatStatusLabel(request.status)}
            </Badge>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Calendar01Icon} className="text-muted-foreground" size={20} />
            <span className="text-sm">
              {format(request.startDate, "eee d LLL y", {locale: fr})} →{" "}
              {format(request.endDate, "d LLL y", {locale: fr})}
            </span>
          </div>

          {/* Nombre de jours */}
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={DateTimeIcon} className="text-muted-foreground" size={20}/>
            <span className="text-sm">
              {request.requestedDays}{" "}
              {request.requestedDays > 1 ? "jours" : "jour"}
            </span>
          </div>

          {/* Motif */}
          {request.reason && (
            <div className="flex items-start gap-2">
              <HugeiconsIcon icon={Message01Icon} className="text-muted-foreground" size={20} strokeWidth={2} />
              <p className="text-sm leading-5">
                {request.reason}
              </p>
            </div>
          )}

          {/* Justificatif */}
          {request.justificationFile && (
            <div className="flex items-center gap-2">
              <Paperclip className="size-4 text-muted-foreground" />
              <a
                href={request.justificationFile}
                target="_blank"
                className="text-primary underline text-sm"
              >
                {"Voir le justificatif"}
              </a>
            </div>
          )}
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant={"outline"}>{"Fermer"}</Button>
            </DialogClose>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default ViewLeaveRequest