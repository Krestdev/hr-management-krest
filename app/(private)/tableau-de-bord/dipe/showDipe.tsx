"use client";
import DipeForm from "@/components/dipeForm";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee, Salarial } from "@/types/types";
import React from "react";
import { SummaryRow } from "@/components/summaryRow";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  salarial: Salarial;
  employee: Employee;
};

function ShowDipe({ isOpen, openChange, salarial, employee }: Props) {
  const totalAmount = (salarial: Salarial) => {
    return (
      salarial.salaire_base.montant +
      salarial.indem_transport.montant +
      salarial.indem_representation.montant +
      salarial.prime_outil.montant +
      salarial.prime_responsable.montant +
      salarial.prime_gestion.montant +
      salarial.logement.montant +
      salarial.nourriture.montant +
      salarial.vehicule.montant +
      salarial.domestique.montant +
      salarial.electricite.montant +
      salarial.eau.montant +
      salarial.carburant.montant +
      salarial.telephone.montant +
      salarial.gardiennage.montant +
      salarial.internet.montant
    );
  };
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{"Détail du DIPE"}</DialogTitle>
          <DialogDescription>{`Consultéz les données salariales de ${employee.firstName} ${employee.lastName}`}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 max-h-[650px] overflow-auto">
          <Card>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <p className="text-[20px]">{"Indemnités et primes"}</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Intitulés</TableHead>
                      <TableHead className="text-right">Montants</TableHead>
                      <TableHead className="text-center">Taxable</TableHead>
                      <TableHead className="text-center">Cotisable</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SummaryRow
                      label="Salaire de base"
                      montant={salarial.salaire_base}
                    />
                    <SummaryRow
                      label="Indemnité transport"
                      montant={salarial.indem_transport}
                    />
                    <SummaryRow
                      label="Indemnité représentation"
                      montant={salarial.indem_representation}
                    />
                    <SummaryRow
                      label="Prime d'outil"
                      montant={salarial.prime_outil}
                    />
                    <SummaryRow
                      label="Prime responsable"
                      montant={salarial.prime_responsable}
                    />
                    <SummaryRow
                      label="Prime gestion"
                      montant={salarial.prime_gestion}
                    />
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-[20px]">{"Avantages en nature"}</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Intitulés</TableHead>
                      <TableHead className="text-right">Montants</TableHead>
                      <TableHead className="text-center">Taxable</TableHead>
                      <TableHead className="text-center">Cotisable</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SummaryRow label="Logement" montant={salarial.logement} />
                    <SummaryRow
                      label="Nourriture"
                      montant={salarial.nourriture}
                    />
                    <SummaryRow label="Véhicule" montant={salarial.vehicule} />
                    <SummaryRow
                      label="Domestique"
                      montant={salarial.domestique}
                    />
                    <SummaryRow
                      label="Électricité"
                      montant={salarial.electricite}
                    />
                    <SummaryRow label="Eau" montant={salarial.eau} />
                    <SummaryRow
                      label="Carburant"
                      montant={salarial.carburant}
                    />
                    <SummaryRow
                      label="Téléphone"
                      montant={salarial.telephone}
                    />
                    <SummaryRow
                      label="Gardiennage"
                      montant={salarial.gardiennage}
                    />
                    <SummaryRow label="Internet" montant={salarial.internet} />
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Montant totlal</p>
                  <p>{(totalAmount(salarial) + " FCFA")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <DialogFooter>
          <Button onClick={() => openChange(false)} variant="outline">Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ShowDipe;
