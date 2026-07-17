"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DetailPresence from "./DetailPresence";
import { Presence } from "@/types/types";

type Props = {
  open: boolean;
  onClose: () => void;
  userName: string;
  presences: Presence[];
  monthLabel: string
};

export default function PresenceComp({
  open,
  onClose,
  userName,
  presences,
  monthLabel
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[530px]! max-h-[90vh]! p-0 flex flex-col gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-white">
          <DialogTitle>{userName}</DialogTitle>
          <DialogDescription>{`Etat de présence de ${userName} du mois de ${monthLabel}`}</DialogDescription>
        </DialogHeader>
        <DetailPresence
          userName={userName}
          monthLabel={monthLabel}
          presences={presences}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
