"use client";

import ErrorComponent from "@/components/error-comp";
import LoadingComponent from "@/components/loading-comp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import LeavesTypeQuery from "@/queries/leaves-type";
import UserQuery from "@/queries/users";
import LeavesQuery from "@/queries/leaves";
import { Employee, LeavesType, Leaves } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";

type Props = {
  isOpen: boolean;
  openChange: React.Dispatch<React.SetStateAction<boolean>>;
  employeeId: number;
};

type LeaveFormState = {
  [code: string]: {
    checked: boolean;
    days: number;
    authorized: boolean;
    isAnnualLeave: boolean;
    id?: number; // Ajout de l'ID du type de congé
    label?: string; // Ajout du label pour référence
    code?: string; // Ajout du code pour référence
  };
};

function ViewConge({ isOpen, openChange, employeeId }: Props) {
  const usersQuery = new UserQuery();
  const leavesTypeQuery = new LeavesTypeQuery();
  const leavesQuery = new LeavesQuery();

  // USERS
  const { data: usersData, isSuccess: isSuccessUsers } = useQuery({
    queryKey: ["employees"],
    queryFn: usersQuery.getAll,
  });

  // LEAVES TYPES
  const { data: leavesTypeData, isSuccess: isLeavesTypeSuccess } = useQuery({
    queryKey: ["leaves-types"],
    queryFn: leavesTypeQuery.getAll,
  });

  // USER LEAVES
  const { data: leavesData, isSuccess: isLeavesSuccess } = useQuery({
    queryKey: ["leaves", employeeId],
    queryFn: () => leavesQuery.getByUserId(employeeId),
  });

  const employee: Employee | undefined = useMemo(() => {
    if (!isSuccessUsers) return undefined;
    return usersData.find((u: Employee) => u.id === employeeId);
  }, [isSuccessUsers, usersData, employeeId]);

  // FORM STATE
  const [formState, setFormState] = useState<LeaveFormState>({});

  // INIT FORM
  React.useEffect(() => {
    if (isLeavesTypeSuccess && employee) {
      const initial: LeaveFormState = {};

      leavesTypeData.items.forEach((t: LeavesType) => {
        const isAuthorized = employee.autorizedLeaves.includes(t.id);
        const isAnnualLeave = t.code === "ANNUAL" || t.label.toLowerCase().includes("annuel");

        initial[t.code] = {
          checked: isAuthorized,
          days: 0,
          authorized: isAuthorized,
          isAnnualLeave: isAnnualLeave,
          id: t.id,
          label: t.label,
          code: t.code,
        };
      });

      setFormState(initial);
    }
  }, [isLeavesTypeSuccess, leavesTypeData, employee]);

  // 🔢 CALCULS MÉTIER
  const consumed = useMemo(() => {
    if (!isLeavesSuccess) return 0;

    return leavesData.items
      .filter((l: Leaves) =>
        ["APPROVED", "IN PROGRESS", "COMPLETED"].includes(l.status),
      )
      .reduce((acc: number, l: Leaves) => acc + l.days, 0);
  }, [isLeavesSuccess, leavesData]);

  const totalAuthorized = useMemo(() => {
    return Object.values(formState).reduce(
      (acc, v) => acc + (v.authorized ? v.days : 0),
      0,
    );
  }, [formState]);

  const solde = Math.max((employee?.leaveDays ?? 0) - consumed, 0);

  if (!employee || !isLeavesTypeSuccess || !isLeavesSuccess) {
    return <LoadingComponent />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{"Gestion des congés"}</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="grid gap-6">
          {/* 👤 EMPLOYEE */}
          <h2 className="text-center text-xl font-semibold">
            {employee.firstName} {employee.lastName}
          </h2>

          {/* 📊 STATS */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Total autorisé</p>
              <p className="text-2xl font-bold">{employee.leaveDays} Jours</p>
            </div>
            <div className="rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Consommés</p>
              <p className="text-2xl font-bold">{consumed} Jours</p>
            </div>
            <div className="rounded-lg p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Solde</p>
              <p className="text-2xl font-bold">{solde} Jours</p>
            </div>
          </div>

          {/* 📁 TYPES */}
          <div className="grid gap-3">
            <h3 className="font-semibold">Types de congés</h3>

            {leavesTypeData.items.map((type: LeavesType) => {
              const state = formState[type.code];
              if (!state) return null;

              // Déterminer si la checkbox doit être désactivée
              const isCheckboxDisabled = state.isAnnualLeave;
              
              // Déterminer si l'input doit être désactivé
              const isInputDisabled = state.isAnnualLeave;

              return (
                <div
                  key={type.id}
                  className="grid grid-cols-[1fr_auto] gap-4 items-center"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={state.checked}
                      disabled={isCheckboxDisabled}
                      onCheckedChange={(val) => {
                        setFormState((prev) => ({
                          ...prev,
                          [type.code]: {
                            ...prev[type.code],
                            checked: !!val,
                          },
                        }));
                      }}
                    />
                    <span
                      className={"text-sm " + (state.isAnnualLeave ? "text-muted-foreground" : "")}
                    >
                      {type.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      disabled={isInputDisabled}
                      value={state.days || 0}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setFormState((prev) => ({
                          ...prev,
                          [type.code]: {
                            ...prev[type.code],
                            days: value,
                          },
                        }));
                      }}
                      className={`w-20 text-center ${
                        state.isAnnualLeave ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    />
                    <span className="text-sm">Jours</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 🔘 ACTIONS */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => openChange(false)}
            >
              Annuler
            </Button>

            <Button
              variant={"accent"}
              onClick={() => {
                // Construction du payload avec TOUS les types de congés
                const allLeaveTypes = Object.entries(formState).map(([code, v]) => ({
                  userId: employeeId,
                  leaveTypeId: v.id,
                  leaveTypeCode: code,
                  leaveTypeLabel: v.label,
                  checked: v.checked,
                  days: v.days,
                  isAnnualLeave: v.isAnnualLeave,
                  authorized: v.authorized
                }));

                const payload = {
                  userId: employeeId,
                  employeeName: `${employee.firstName} ${employee.lastName}`,
                  leaveTypes: allLeaveTypes,
                  summary: {
                    totalAuthorized: employee.leaveDays,
                    consumed: consumed,
                    balance: solde
                  }
                };

                console.log("PAYLOAD COMPLET:", JSON.stringify(payload, null, 2));
                
                // Alternative: Format plus simple si vous préférez
                const simplePayload = {
                  userId: employeeId,
                  leaves: allLeaveTypes.map(lt => ({
                    leaveTypeId: lt.leaveTypeId,
                    code: lt.leaveTypeCode,
                    label: lt.leaveTypeLabel,
                    selected: lt.checked,
                    days: lt.days
                  }))
                };

                console.log("PAYLOAD SIMPLE:", JSON.stringify(simplePayload, null, 2));
                
                openChange(false);
              }}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewConge;