import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getInitials } from "@/lib/utils";
import { Employee } from "@/types/types";
import { format } from "date-fns";
import React from "react";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  employee: Employee;
  users: Array<Employee>;
};

function ViewProfile({ isOpen, openChange, employee, users }: Props) {
  const supervisor = users.find((x) => x.id === employee.supervisorId);
  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{"Profil Employé"}</DialogTitle>
          <DialogDescription>
            {"Informations relatives à l'employé"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 @container">
          <div className="flex gap-4 items-center">
            <Avatar className="size-20">
              <AvatarImage src={employee.photo} />
              <AvatarFallback>
                {getInitials(employee.firstName.concat(" ", employee.lastName))}
              </AvatarFallback>
            </Avatar>
            <div className="w-full flex flex-col gap-0.5 text-center sm:text-left">
              <span className="text-[clamp(18px,2vw,24px)] font-semibold">
                {employee.firstName.concat(" ", employee.lastName)}
              </span>
              <p className="text-slate-800">
                <span className="text-slate-600 font-light">{"Poste: "}</span>
                {employee.position}
              </p>
            </div>
          </div>
          {/**Infos personnelles */}
          <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-6 @min-[460px]:grid-cols-2 @min-[760px]:grid-cols-3 @min-[1024px]:grid-cols-4 @min-[1280px]:grid-cols-5 @min-[1560px]:grid-cols-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Adresse mail"}</span>
              <span className="font-medium">{employee.email}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Sexe"}</span>
              <span className="font-medium">{employee.gender}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Date de naissance"}</span>
              <span className="font-medium">
                {format(employee.birthDate, "dd/MM/yyyy")}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Nationalité"}</span>
              <span className="font-medium">{employee.nationality}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Pays de résidence"}</span>
              <span className="font-medium">{employee.country}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Adresse"}</span>
              <span className="font-medium">{employee.address}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Numero de téléphone"}</span>
              <span className="font-medium">{employee.phone}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Situation matrimoniale"}</span>
              <span className="font-medium">{employee.maritalStatus}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Enfants"}</span>
              <span className="font-medium">
                {employee.childrenCount === 0
                  ? "Aucun"
                  : employee.childrenCount}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Contact d'urgence"}</span>
              <span className="font-medium">{employee.emergencyContact}</span>
            </div>
          </div>
          {/**Infos administratives */}
          <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-6 @min-[460px]:grid-cols-2 @min-[760px]:grid-cols-3 @min-[1024px]:grid-cols-4 @min-[1280px]:grid-cols-5 @min-[1560px]:grid-cols-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"CNPS"}</span>
              <span className="font-medium">
                {employee.cnpsNumber ?? "Non défini"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Pièce d'identité"}</span>
              <span className="font-medium">
                {`${employee.idType} - ${employee.idNumber}`}
                <br />
                <span className="text-[12px] text-slate-600 font-normal">{`Délivrée le ${
                  employee.idIssueDate &&
                  format(employee.idIssueDate, "dd/MM/yyyy")
                } à ${employee.idIssuePlace}, expire le ${
                  employee.idExpiryDate &&
                  format(employee.idExpiryDate, "dd/MM/yyyy")
                }`}</span>
              </span>
            </div>
          </div>
          {/**Informations personnelles */}
          <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-6 @min-[460px]:grid-cols-2 @min-[760px]:grid-cols-3 @min-[1024px]:grid-cols-4 @min-[1280px]:grid-cols-5 @min-[1560px]:grid-cols-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Poste"}</span>
              <span className="font-medium">{employee.position}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Département"}</span>
              <span className="font-medium">{employee.department}</span>
            </div>
            {!!supervisor && (
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-600">
                  {"Supérieur hiérarchique"}
                </span>
                <span className="font-medium">
                  {supervisor.firstName.concat(" ", supervisor.lastName)}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Catégorie"}</span>
              <span className="font-medium">{employee.category}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Grade"}</span>
              <span className="font-medium">{employee.level}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Contrat"}</span>
              <span className="font-medium">{employee.contractType}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Date de début"}</span>
              <span className="font-medium">
                {employee.startDate && format(employee.startDate, "dd/MM/yyyy")}
              </span>
            </div>
            {employee.endDate && (
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-600">{"Date de fin"}</span>
                <span className="font-medium">
                  {employee.endDate && format(employee.endDate, "dd/MM/yyyy")}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <span className="text-slate-600">{"Lieu de travail"}</span>
              <span className="font-medium">{`${employee.workLocation}`}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant={"outline"}>{"Fermer"}</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ViewProfile;
