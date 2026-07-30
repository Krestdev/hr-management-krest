"use client";

import EmployeeForm from "@/components/employee-form";
import ErrorComponent from "@/components/error-comp";
import LoadingComponent from "@/components/loading-comp";
import useKizunaStore from "@/context/store";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Users, ArrowLeft } from "lucide-react";
import Header from "@/components/header";
import { useEmployeesQuery } from "@/hooks/queries-hooks";

const Page = () => {
  const { user, isHydrated } = useKizunaStore();
  const [mode, setMode] = useState<"CHOICE" | "EXISTING" | "NEW">("CHOICE");
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data, isSuccess, isLoading, isPending, isError, error } = useEmployeesQuery(
    1,
    100,
    user?.companyId || "",
    "",
    "",
    "ACTIVE",
    "",
    true,
    true,
    isHydrated && !!user
  );

  if (!isHydrated || isPending || isLoading) {
    return <LoadingComponent />;
  }
  if (isError) {
    return <ErrorComponent description={error.message} />;
  }

  const users = data?.data || [];
  const selectedUser = users.find(u => u.uuid === selectedUserId);

  if (mode === "CHOICE") {
    return (
      <div>
        <Header title="Enregistrer un employé" variant={"primary"} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <button
              onClick={() => setMode("EXISTING")}
              className="cursor-pointer flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-xl hover:bg-gray-50 hover:border-primary transition-colors text-center bg-white"
            >
              <div className="p-4 bg-gray-100 rounded-full">
                <Users className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{"Utilisateur existant"}</h3>
                <p className="text-sm text-gray-500 mt-1">{"Ajouter un employé à partir d'un compte utilisateur déjà créé."}</p>
              </div>
            </button>

            <button
              onClick={() => setMode("NEW")}
              className="cursor-pointer flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-xl hover:bg-gray-50 hover:border-primary transition-colors text-center bg-white"
            >
              <div className="p-4 bg-gray-100 rounded-full">
                <UserPlus className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{"Nouvel utilisateur"}</h3>
                <p className="text-sm text-gray-500 mt-1">{"Créer simultanément le compte utilisateur et la fiche employé."}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "EXISTING" && !selectedUser) {
    return (
      <div className="max-w-[800px] flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setMode("CHOICE")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-medium mb-1">{"Sélectionner un utilisateur"}</h1>
            <p className="text-sm text-gray-500">{"Choisissez l'utilisateur à définir comme employé"}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="max-w-[400px] space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{"Utilisateur"}</label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Rechercher ou sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map(u => (
                    <SelectItem key={u.uuid} value={u.uuid}>
                      {u.firstName} {u.lastName} {u.email ? `(${u.email})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] grid gap-4">
      <div className="flex items-center gap-4 mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (mode === "EXISTING") {
              setSelectedUserId("");
            } else {
              setMode("CHOICE");
            }
          }}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <span className="text-sm font-medium text-gray-500">
          {mode === "EXISTING" ? "Retour à la sélection" : "Retour aux choix"}
        </span>
      </div>
      <EmployeeForm users={users} employee={mode === "EXISTING" ? selectedUser : undefined} />
    </div>
  );
};

export default Page;