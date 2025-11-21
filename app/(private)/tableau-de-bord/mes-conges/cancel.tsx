'use client'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import HolidaysQuery from '@/queries/holidays';
import { HolidayRequest } from '@/types/types';
import { Calendar01Icon, DateTimeIcon, InformationCircleIcon, Message01Icon, OfficeChairIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { toast } from 'sonner';
import { badgeStatusVariant, formatStatusLabel } from './page';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { Paperclip } from 'lucide-react';

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  request: HolidayRequest;
};

function CancelLeaveRequest({isOpen,openChange, request}:Props) {
    const holidaysQuery = new HolidaysQuery();
    const { mutate, isPending } = useMutation({
        mutationFn: (id:number)=>holidaysQuery.cancelRequest(id),
        onSuccess: ()=>{
            toast.success("Votre demande a été annulée !");
            openChange(false);
        },
        onError: (error)=>{
            toast.error(error.message);
        }
    })
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
        <DialogContent>
            <DialogHeader className="bg-destructive/10">
                <DialogTitle>{"Annuler ma demande"}</DialogTitle>
                <DialogDescription>{"Formulaire d'annulation de demande d'absence"}</DialogDescription>
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
                <Button variant={"destructive"} onClick={()=>mutate(request.id)} isLoading={isPending} disabled={isPending}>{"Oui"}</Button>
                <Button variant={"outline"} onClick={()=>openChange(prev=>!prev)} disabled={isPending}>{"Non"}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default CancelLeaveRequest