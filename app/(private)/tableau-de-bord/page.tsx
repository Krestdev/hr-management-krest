'use client'
import StatisticCard from '@/components/statistic-card';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import useKizunaStore from '@/context/store';
import HolidaysQuery from '@/queries/holidays';
import UserQuery from '@/queries/users';
import { AddSquareIcon, Calendar02Icon, Calendar03Icon, File02Icon, FolderLibraryIcon, LinkForwardIcon, Notification01Icon, Notification02Icon, PropertyEditIcon, UserGroupIcon, UserSquareIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Page() {
  const { user } = useKizunaStore();
  const router = useRouter();
  const holidaysQuery = new HolidaysQuery();
  const userQuery = new UserQuery();
  const stats = useQuery({
    queryKey: ["statistics"],
    queryFn: holidaysQuery.getStats,
    enabled: user?.role !== "USER"
  });
  const employees = useQuery({
    queryKey: ["employees"],
    queryFn: userQuery.getAll,
    enabled: user?.role !== "USER"
  });
  const userHolidays = useQuery({
    queryKey: ["self-holidays", user?.id],
    queryFn: () => holidaysQuery.getBalance(user?.id ?? 0),
    enabled: !!user
  });
  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <header className="flex flex-col">
          <h2>{`Bonjour ${user?.firstName},`}</h2>
          <p className="text-neutral-600 text-sm">{"Bienvenue sur votre tableau de bord"}</p>
      </header>
      <section className="w-full grid grid-cols-1 gap-5 @min-[640px]/main:grid-cols-2 @min-[1024px]/main:grid-cols-3 @min-[1280px]/main:grid-cols-4">
        { stats.isSuccess && 
        <StatisticCard title="Demandes de congés en attente" value={stats.data.pendingRequests} variant={"primary"} advanced={{title:"Nombre total de demandes", value:stats.data.totalRequests}}>
          <DropdownMenuItem>
            <Link href={"/tableau-de-bord/conges"}>{"Gérer les demandes"}</Link>
          </DropdownMenuItem>
        </StatisticCard>}
        { employees.isSuccess &&
          <StatisticCard title="Total Employés" value={employees.data.length} variant={"dark"}>
            <DropdownMenuItem>
              <Link href={"/tableau-de-bord/employes"}>{"Voir la liste des employés"}</Link>
            </DropdownMenuItem>
          </StatisticCard>}
        { userHolidays.isSuccess && 
        <StatisticCard title="Solde de congés" value={userHolidays.data.remainingDays} variant={"default"} advanced={{title: "Année", value: userHolidays.data.year}}>
          <DropdownMenuItem>
            <Link href={"/tableau-de-bord/mes-conges"}>{"Mes congés"}</Link>
          </DropdownMenuItem>
        </StatisticCard>}
        { 
          user?.role !== "USER" && 
          <StatisticCard title="Bulletins générés" value={487} advanced={{title:"Dernier bulletin", value: "Août"}}>
            <DropdownMenuItem>
              <Link href={"/tableau-de-bord/dipe"}>{"DIPE"}</Link>
            </DropdownMenuItem>
          </StatisticCard>
        }
        { user?.role === "USER" && userHolidays.isSuccess &&
        <StatisticCard variant={"grey"} title="Congés utilisés" value={userHolidays.data.usedDays} advanced={{value: `sur ${userHolidays.data.earnedDays} jour(s)`}}/>
        }
        { user?.role === "USER" && 
        <StatisticCard title="Dernier bulletin disponible" value={"Septembre 2025"} advanced={{value: "13 Bulletins"}}>
          <DropdownMenuItem>
            <Link href={"/tableau-de-bord/mes-bulletins"}>{"Mes bulletins de paie"}</Link>
          </DropdownMenuItem>
        </StatisticCard>}
      </section>
      <section className="grid grid-cols-1 gap-4 @min-[640px]/main:gap-6 @min-[960px]/main:grid-cols-3">
      {/**Quick links START */}
          <div className="@container col-span-1 @min-[960px]/main:col-span-2 card-1">
            <div className="card-1-header">
              <h3 className="flex items-center gap-2"><span className="card-1-icon bg-primary-500"><HugeiconsIcon icon={LinkForwardIcon} size={20} strokeWidth={2}/></span>{"Liens rapides"}</h3>
            </div>
            <div className="w-full grid grid-cols-1 gap-2 @min-[260px]:grid-cols-2 @min-[340px]:grid-cols-3 @min-[460px]:grid-cols-4 @min-[578px]:grid-cols-5 @min-[760px]:grid-cols-6">
              {
                user?.role !== "USER" &&
                <>
                  <Link href={"/tableau-de-bord/conges"} className="quick-container">
                  <button className="quick-action">
                    <HugeiconsIcon icon={PropertyEditIcon} />
                  </button>
                  <span className='text-center text-xs font-medium'>{"Gérer les demandes de congés"}</span>
                </Link>
                <Link href={"/tableau-de-bord/employes"} className="quick-container">
                  <button className="quick-action">
                    <HugeiconsIcon icon={UserGroupIcon} />
                  </button>
                  <span className='text-center text-xs font-medium'>{"Gérer l'effectif"}</span>
                </Link>
                </>
              }
              <Link href={"/tableau-de-bord/mes-conges/creer"} className="quick-container">
                <button className="quick-action">
                  <HugeiconsIcon icon={AddSquareIcon} />
                </button>
                <span className='text-center text-xs font-medium'>{"Demande d'absence"}</span>
              </Link>
              <Link href={"/tableau-de-bord/mes-bulletins"} className="quick-container">
                <button className="quick-action">
                  <HugeiconsIcon icon={File02Icon} />
                </button>
                <span className='text-center text-xs font-medium'>{"Mes bulletins de paie"}</span>
              </Link>
              <Link href={"/tableau-de-bord/mes-conges/creer"} className="quick-container">
                <button className="quick-action">
                  <HugeiconsIcon icon={UserSquareIcon} />
                </button>
                <span className='text-center text-xs font-medium'>{"Voir mon profil"}</span>
              </Link>
            </div>
          </div>
          {/**Quick links END */}
          <div className="card-1 bg-accent relative">
            <div className="card-1-header z-1">
              <h3 className="text-white flex items-center gap-2"><span className="card-1-icon bg-white text-accent"><HugeiconsIcon icon={FolderLibraryIcon} size={20} strokeWidth={2}/></span>{"Mes Documents"}</h3>
            </div>
            <div className="text-white">
              <p className="text-[clamp(28px,2vw,40px)] font-semibold">{"12"}</p>
              <span className="text-sm">{"Enregistré(s)"}</span>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-2/3 rounded-full blur-2xl bg-white/30" />
          </div> 
      </section>
      {/**Section */}
      <section className="grid grid-cols-1 gap-4 @min-[640px]/main:gap-6 @min-[960px]/main:grid-cols-3">
      <div className="card-1">
        <div className="card-1-header">
          <h3 className="flex items-center gap-2"><span className="card-1-icon"><HugeiconsIcon icon={Notification01Icon} size={20} strokeWidth={2}/></span>{"Notifications récentes"}</h3>
        </div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <HugeiconsIcon icon={Notification02Icon} />
            </EmptyMedia>
            <EmptyTitle>{"Aucune notification"}</EmptyTitle>
            <EmptyDescription>{"Vous n'avez pas de notification enregistrée."}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
      {/**Awaiting leave requests for RH & ADMIN */}
      {
        user?.role !== user ?
      <div className="card-1 @min-[960px]/main:col-span-2">
        <div className="card-1-header">
          <h3 className="flex items-center gap-2">
            <span className="card-1-icon bg-accent"><HugeiconsIcon icon={Calendar03Icon} size={20} strokeWidth={2}/></span>
            {"Historique de présence"}
          </h3>
        </div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <HugeiconsIcon icon={Calendar02Icon} />
            </EmptyMedia>
            <EmptyTitle>{"Aucune donnée disponible"}</EmptyTitle>
            <EmptyDescription>{"Vous n'avez pas encore d'historique de présence."}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
      :
      <div className="card-1 @min-[960px]/main:col-span-2">
        <div className="card-1-header">
          <h3 className="flex items-center gap-2">
            <span className="card-1-icon bg-accent"><HugeiconsIcon icon={Calendar03Icon} size={20} strokeWidth={2}/></span>
            {"Historique des congés"}
          </h3>
        </div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <HugeiconsIcon icon={Calendar02Icon} />
            </EmptyMedia>
            <EmptyTitle>{"Aucun congé"}</EmptyTitle>
            <EmptyDescription>{"Vous n'avez pas de demande d'absence enregistrée."}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
      }
      {/**END Awaiting Requests */}
      </section>
    </div>
  )
}

export default Page