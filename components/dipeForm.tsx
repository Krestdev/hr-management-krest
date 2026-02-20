"use client";

import { Employee, Salarial } from "@/types/types";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn } from "@/lib/utils";
import { LucideCheck, LucideX } from "lucide-react";
import { SummaryRow } from "./summaryRow";

interface Props {
  salarial: Salarial[];
  employee: Employee;
  onSuccess?: () => void;
}

type MontantForm = {
  montant: number;
  type: "INDEMNITE" | "PRIME" | "AVANTAGE";
  est_taxable: boolean;
  est_cotisable: boolean;
};

type SalarialForm = {
  salaire_base: MontantForm;
  indem_transport: MontantForm;
  indem_representation: MontantForm;
  prime_outil: MontantForm;
  prime_responsable: MontantForm;
  prime_gestion: MontantForm;
  logement: MontantForm;
  nourriture: MontantForm;
  vehicule: MontantForm;
  domestique: MontantForm;
  electricite: MontantForm;
  eau: MontantForm;
  carburant: MontantForm;
  telephone: MontantForm;
  gardiennage: MontantForm;
  internet: MontantForm;
};

const defaultMontant = (
  type: "INDEMNITE" | "PRIME" | "AVANTAGE",
): MontantForm => ({
  montant: 0,
  type,
  est_taxable: false,
  est_cotisable: false,
});

const createEmptySalarial = (): SalarialForm => ({
  salaire_base: defaultMontant("INDEMNITE"),
  indem_transport: defaultMontant("INDEMNITE"),
  indem_representation: defaultMontant("INDEMNITE"),
  prime_outil: defaultMontant("PRIME"),
  prime_responsable: defaultMontant("PRIME"),
  prime_gestion: defaultMontant("PRIME"),
  logement: defaultMontant("AVANTAGE"),
  nourriture: defaultMontant("AVANTAGE"),
  vehicule: defaultMontant("AVANTAGE"),
  domestique: defaultMontant("AVANTAGE"),
  electricite: defaultMontant("AVANTAGE"),
  eau: defaultMontant("AVANTAGE"),
  carburant: defaultMontant("AVANTAGE"),
  telephone: defaultMontant("AVANTAGE"),
  gardiennage: defaultMontant("AVANTAGE"),
  internet: defaultMontant("AVANTAGE"),
});

const DipeForm = ({ salarial, employee, onSuccess }: Props) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SalarialForm>(() => {
    // Rechercher le salarial de l'employé
    const employeeSalarial = salarial?.find(x => x.userId === employee.id);
    
    if (employeeSalarial) {
      return mapSalarialToForm(employeeSalarial);
    }
    return createEmptySalarial();
  });

  const isEditMode = salarial?.some(x => x.userId === employee.id) || false;

  const updateMontant = (
    field: keyof SalarialForm,
    key: keyof MontantForm,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: key === "montant" ? parseFloat(value as string) || 0 : value,
      },
    }));
  };

  const handleSubmit = () => {
    // Ici vous feriez l'appel API pour sauvegarder
    console.log("Données à sauvegarder:", formData);
    onSuccess?.();
  };

  const totalStep1 = () => {
    const fields = [
      formData.salaire_base,
      formData.indem_transport,
      formData.indem_representation,
      formData.prime_outil,
      formData.prime_responsable,
      formData.prime_gestion,
    ];
    return fields.reduce((acc, curr) => acc + curr.montant, 0);
  };

  const totalStep2 = () => {
    const fields = [
      formData.logement,
      formData.nourriture,
      formData.vehicule,
      formData.domestique,
      formData.electricite,
      formData.eau,
      formData.carburant,
      formData.telephone,
      formData.gardiennage,
      formData.internet,
    ];
    return fields.reduce((acc, curr) => acc + curr.montant, 0);
  };

  const totalGeneral = () => totalStep1() + totalStep2();

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step === s
                  ? "bg-primary text-primary-foreground"
                  : step > s
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600",
              )}
            >
              {step > s ? "✓" : s}
            </div>
            {s < 3 && (
              <div
                className={cn(
                  "w-12 h-1 mx-2",
                  step > s ? "bg-green-500" : "bg-gray-200",
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Primes et Indemnités */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Primes et Indemnités</CardTitle>
            <CardDescription>
              Configurez les primes et indemnités de base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <MontantField
                label="Salaire de base"
                field="salaire_base"
                montant={formData.salaire_base}
                updateMontant={updateMontant}
              />
              <MontantField
                label="Indemnité de transport"
                field="indem_transport"
                montant={formData.indem_transport}
                updateMontant={updateMontant}
              />
              <MontantField
                label="Indemnité de représentation"
                field="indem_representation"
                montant={formData.indem_representation}
                updateMontant={updateMontant}
              />
              <MontantField
                label="Prime d'outil"
                field="prime_outil"
                montant={formData.prime_outil}
                updateMontant={updateMontant}
              />
              <MontantField
                label="Prime de responsable"
                field="prime_responsable"
                montant={formData.prime_responsable}
                updateMontant={updateMontant}
              />
              <MontantField
                label="Prime de gestion"
                field="prime_gestion"
                montant={formData.prime_gestion}
                updateMontant={updateMontant}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Avantages */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Avantages en nature</CardTitle>
            <CardDescription>
              Configurez les avantages et prestations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <MontantField
                label="Logement"
                field="logement"
                montant={formData.logement}
                updateMontant={updateMontant}
              />
              <MontantField
                label="Nourriture"
                field="nourriture"
                montant={formData.nourriture}
                updateMontant={updateMontant}
              />
              <MontantField
                label="Véhicule"
                field="vehicule"
                montant={formData.vehicule}
                updateMontant={updateMontant}
              />
              <MontantField
                label="Domestique"
                field="domestique"
                montant={formData.domestique}
                updateMontant={updateMontant}
              />
              <MontantField
                label="Électricité"
                field="electricite"
                montant={formData.electricite}
                updateMontant={updateMontant}
              />
              <MontantField
                label="Eau"
                field="eau"
                montant={formData.eau}
                updateMontant={updateMontant}
              />
              <MontantField
                label="Carburant"
                field="carburant"
                montant={formData.carburant}
                updateMontant={updateMontant}
              />
              <MontantField
                label="Téléphone"
                field="telephone"
                montant={formData.telephone}
                updateMontant={updateMontant}
              />
              <MontantField
                label="Gardiennage"
                field="gardiennage"
                montant={formData.gardiennage}
                updateMontant={updateMontant}
              />
              <MontantField
                label="Internet"
                field="internet"
                montant={formData.internet}
                updateMontant={updateMontant}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Récapitulatif */}
      {step === 3 && (
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
                    montant={formData.salaire_base}
                  />
                  <SummaryRow
                    label="Indemnité transport"
                    montant={formData.indem_transport}
                  />
                  <SummaryRow
                    label="Indemnité représentation"
                    montant={formData.indem_representation}
                  />
                  <SummaryRow
                    label="Prime d'outil"
                    montant={formData.prime_outil}
                  />
                  <SummaryRow
                    label="Prime responsable"
                    montant={formData.prime_responsable}
                  />
                  <SummaryRow
                    label="Prime gestion"
                    montant={formData.prime_gestion}
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
                  <SummaryRow label="Logement" montant={formData.logement} />
                  <SummaryRow label="Nourriture" montant={formData.nourriture} />
                  <SummaryRow label="Véhicule" montant={formData.vehicule} />
                  <SummaryRow label="Domestique" montant={formData.domestique} />
                  <SummaryRow
                    label="Électricité"
                    montant={formData.electricite}
                  />
                  <SummaryRow label="Eau" montant={formData.eau} />
                  <SummaryRow label="Carburant" montant={formData.carburant} />
                  <SummaryRow label="Téléphone" montant={formData.telephone} />
                  <SummaryRow
                    label="Gardiennage"
                    montant={formData.gardiennage}
                  />
                  <SummaryRow label="Internet" montant={formData.internet} />
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total général</p>
                <p className="text-2xl font-bold">{totalGeneral().toLocaleString()} FCFA</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          Précédent
        </Button>

        {step < 3 ? (
          <Button variant={"primary"} type="button" onClick={() => setStep(step + 1)}>
            Suivant
          </Button>
        ) : (
          <Button variant={"primary"} type="button" onClick={handleSubmit}>
            {isEditMode ? "Modifier" : "Ajouter"} le DIPE
          </Button>
        )}
      </div>
    </div>
  );
};

// Sous-composant pour les champs de montant
const MontantField = ({
  label,
  field,
  montant,
  updateMontant,
}: {
  label: string;
  field: keyof SalarialForm;
  montant: MontantForm;
  updateMontant: (
    field: keyof SalarialForm,
    key: keyof MontantForm,
    value: string | boolean,
  ) => void;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center border-b pb-4">
    <Label className="font-medium">{label}</Label>
    <div className="col-span-1">
      <Input
        type="number"
        value={montant.montant || ""}
        onChange={(e) => updateMontant(field, "montant", e.target.value)}
        placeholder="Montant"
        className="w-full"
      />
    </div>
    <div className="flex items-center space-x-4 col-span-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${field}-taxable`}
          checked={montant.est_taxable}
          onCheckedChange={(checked) =>
            updateMontant(field, "est_taxable", checked as boolean)
          }
        />
        <Label htmlFor={`${field}-taxable`} className="text-sm">
          Taxable
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${field}-cotisable`}
          checked={montant.est_cotisable}
          onCheckedChange={(checked) =>
            updateMontant(field, "est_cotisable", checked as boolean)
          }
        />
        <Label htmlFor={`${field}-cotisable`} className="text-sm">
          Cotisable
        </Label>
      </div>
    </div>
  </div>
);



// Fonction utilitaire pour mapper les données existantes
function mapSalarialToForm(salarial: Salarial): SalarialForm {
  return {
    salaire_base: salarial.salaire_base,
    indem_transport: salarial.indem_transport,
    indem_representation: salarial.indem_representation,
    prime_outil: salarial.prime_outil,
    prime_responsable: salarial.prime_responsable,
    prime_gestion: salarial.prime_gestion,
    logement: salarial.logement,
    nourriture: salarial.nourriture,
    vehicule: salarial.vehicule,
    domestique: salarial.domestique,
    electricite: salarial.electricite,
    eau: salarial.eau,
    carburant: salarial.carburant,
    telephone: salarial.telephone,
    gardiennage: salarial.gardiennage,
    internet: salarial.internet,
  };
}

export default DipeForm;