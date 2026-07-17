"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Presence } from "@/types/types";
import { useUpdatePresenceMutation } from "@/queries/presences";
import { toast } from "sonner";
import { setHours, setMinutes, parseISO, formatISO } from "date-fns";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  presence: Presence | null;
};

export default function EditPresenceModal({ open, onClose, presence }: Props) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const updateMutation = useUpdatePresenceMutation();

  useEffect(() => {
    if (presence && open) {
      if (presence.checkIn) {
        const d = new Date(presence.checkIn);
        setCheckIn(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
      } else {
        setCheckIn("");
      }
      if (presence.checkOut) {
        const d = new Date(presence.checkOut);
        setCheckOut(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
      } else {
        setCheckOut("");
      }
    }
  }, [presence, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!presence) return;

    let newCheckIn: string | undefined;
    let newCheckOut: string | undefined;

    const baseDateString = presence.checkIn || presence.createdAt;
    if (!baseDateString) {
      toast.error("Impossible de déterminer la date de base");
      return;
    }
    const baseDate = parseISO(baseDateString);

    if (checkIn) {
      const [h, m] = checkIn.split(":").map(Number);
      newCheckIn = formatISO(setMinutes(setHours(baseDate, h), m));
    }
    
    if (checkOut) {
      const [h, m] = checkOut.split(":").map(Number);
      newCheckOut = formatISO(setMinutes(setHours(baseDate, h), m));
    }

    updateMutation.mutate(
      {
        id: presence.uuid,
        data: {
          employeeId: presence.employeeId,
          checkIn: newCheckIn,
          checkOut: newCheckOut,
        },
      },
      {
        onSuccess: () => {
          toast.success("Présence modifiée avec succès");
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || "Erreur lors de la modification");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la présence</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="checkIn" className="text-right">
              Arrivée
            </Label>
            <Input
              id="checkIn"
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="checkOut" className="text-right">
              Départ
            </Label>
            <Input
              id="checkOut"
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={updateMutation.isPending}>
              Annuler
            </Button>
            <Button type="submit" className="bg-cyan-700 hover:bg-cyan-800" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
