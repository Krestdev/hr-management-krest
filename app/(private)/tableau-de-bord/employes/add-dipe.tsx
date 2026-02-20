"use client";
import DipeForm from "@/components/dipeForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Employee, Salarial } from "@/types/types";
import React from "react";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  salarial: Salarial[];
  employee: Employee;
};

function AddDipe({ isOpen, openChange, salarial, employee }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{"Ajouter le DIPE"}</DialogTitle>
          <DialogDescription>{`Renseignez les données salariales de ${employee.firstName} ${employee.lastName}`}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 max-h-[650px] overflow-auto">
            <DipeForm salarial={salarial} employee={employee} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddDipe;
