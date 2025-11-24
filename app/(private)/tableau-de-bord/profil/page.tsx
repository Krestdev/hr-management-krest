'use client'
import Header from '@/components/header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import useKizunaStore from '@/context/store'
import { getInitials } from '@/lib/utils';
import UserQuery from '@/queries/users';
import { Edit03Icon, FileAttachmentIcon, Profile02Icon, UserAccountIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import React, { useState } from 'react'
import UpdatePhoto from './update-photo';

function Page() {
  const { user } = useKizunaStore();
  const usersQuery = new UserQuery();
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["user", user?.supervisorId],
    queryFn: async()=>usersQuery.getUser(user?.supervisorId ?? 0),
    enabled: !!user
  });
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  return (
    <div className="grid gap-4 sm:gap-6">
      <Header title="Profil" variant={"primary"} />
      <section className="card-1 pb-8">
        <div className='card-1-header flex-row items-center gap-2'>
          <span className="card-1-icon bg-accent"><HugeiconsIcon icon={UserAccountIcon} /></span>
          <h3>{"Informations personnelles"}</h3>
        </div>
        {/**Avatar & Noms */}
        <div className="flex flex-col gap-4 items-center sm:flex-row">
          <div className="relative w-fit">
            <Avatar className="size-32">
              <AvatarImage src={user?.photo} />
              <AvatarFallback>{getInitials(user?.firstName.concat(" ", user.lastName))}</AvatarFallback>
            </Avatar>
            <Button size={"icon-sm"} variant={"outline"} className="absolute bottom-2 right-2" onClick={()=>setOpenUpdate(true)}><HugeiconsIcon icon={Edit03Icon} /></Button>
          </div>
          <div className="w-full flex flex-col gap-0.5 text-center sm:text-left">
            <span className="text-[clamp(18px,2vw,24px)] font-semibold">{user?.firstName.concat(" ",user.lastName)}</span>
            <p className="text-slate-800"><span className="text-slate-600 font-light">{"Poste: "}</span>{user?.position}</p>
          </div>
        </div>
        {/**Infos personnelles */}
        <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-6 @min-[460px]/main:grid-cols-2 @min-[760px]/main:grid-cols-3 @min-[1024px]/main:grid-cols-4 @min-[1280px]/main:grid-cols-5 @min-[1560px]/main:grid-cols-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Adresse mail"}</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Sexe"}</span>
            <span className="font-medium">{user?.gender}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Date de naissance"}</span>
            <span className="font-medium">{user && format(user.birthDate, "dd/MM/yyyy")}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Nationalité"}</span>
            <span className="font-medium">{user?.nationality}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Pays de résidence"}</span>
            <span className="font-medium">{user?.country}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Adresse"}</span>
            <span className="font-medium">{user?.address}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Numero de téléphone"}</span>
            <span className="font-medium">{user?.phone}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Situation matrimoniale"}</span>
            <span className="font-medium">{user?.maritalStatus}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Enfants"}</span>
            <span className="font-medium">{user?.childrenCount === 0 ? "Aucun" : user?.childrenCount}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Contact d'urgence"}</span>
            <span className="font-medium">{user?.emergencyContact}</span>
          </div>
        </div>
      </section>
      {/**Infos administratives */}
      <section className="card-1 pb-8">
        <div className="card-1-header flex-row items-center gap-2">
          <span className="card-1-icon bg-lime-600"><HugeiconsIcon icon={FileAttachmentIcon} /></span>
          <h3>{"Informations administratives"}</h3>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-6 @min-[460px]/main:grid-cols-2 @min-[760px]/main:grid-cols-3 @min-[1024px]/main:grid-cols-4 @min-[1280px]/main:grid-cols-5 @min-[1560px]/main:grid-cols-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"CNPS"}</span>
            <span className="font-medium">{user?.cnpsNumber ?? "Non défini"}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Pièce d'identité"}</span>
            <span className="font-medium">
              {`${user?.idType} - ${user?.idNumber}`}
              <br/>
              <span className="text-[12px] text-slate-600 font-normal">{`Délivrée le ${user?.idIssueDate && format(user.idIssueDate, "dd/MM/yyyy")} à ${user?.idIssuePlace}, expire le ${user?.idExpiryDate && format(user.idExpiryDate, "dd/MM/yyyy")}`}</span>
            </span>
          </div>
        </div>
      </section>
      {/**Infos professionnelles */}
      <section className="card-1 pb-8">
        <div className="card-1-header flex-row items-center gap-2">
          <span className="card-1-icon bg-purple-600"><HugeiconsIcon icon={Profile02Icon} /></span>
          <h3>{"Informations Professionnelles"}</h3>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-6 @min-[460px]/main:grid-cols-2 @min-[760px]/main:grid-cols-3 @min-[1024px]/main:grid-cols-4 @min-[1280px]/main:grid-cols-5 @min-[1560px]/main:grid-cols-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Poste"}</span>
            <span className="font-medium">{user?.position}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Département"}</span>
            <span className="font-medium">
              {user?.department}
            </span>
          </div>
          {
            isSuccess &&
            <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Supérieur hiérarchique"}</span>
            <span className="font-medium">{ !!data ? data.user.firstName.concat(" ", data.user.lastName) : "Aucun"}</span>
          </div>
          }
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Catégorie"}</span>
            <span className="font-medium">
              {user?.category}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Grade"}</span>
            <span className="font-medium">
              {user?.level}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Contrat"}</span>
            <span className="font-medium">
              {user?.contractType}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Date de début"}</span>
            <span className="font-medium">
              {user?.startDate && format(user.startDate, "dd/MM/yyyy")}
            </span>
          </div>
          {
            user?.endDate &&
            <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Date de fin"}</span>
            <span className="font-medium">
              {user.endDate && format(user.endDate, "dd/MM/yyyy")}
            </span>
          </div>
          }
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-600">{"Lieu de travail"}</span>
            <span className="font-medium">
              {`${user?.workLocation}`}
            </span>
          </div>
        </div>
      </section>
      <UpdatePhoto open={openUpdate} openChange={setOpenUpdate} photo={user?.photo} />
    </div>
  )
}

export default Page