'use client'
import StatisticCard from '@/components/statistic-card';
import useKizunaStore from '@/context/store';
import HolidaysQuery from '@/queries/holidays';
import UserQuery from '@/queries/users';
import { useQuery } from '@tanstack/react-query';
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
  })
  return (
    <div>
      <section className="w-full grid grid-cols-1 gap-5 @min-[640px]:grid-cols-2 @min-[1024px]:grid-cols-3 @min-[1280px]:grid-cols-4">

        { stats.isSuccess && <StatisticCard title="Demandes de congés en attente" value={stats.data.pendingRequests} variant={"primary"} advanced={{title:"Nombre total de demandes", value:stats.data.totalRequests}} />}
        { employees.isSuccess &&
          <StatisticCard title="Total Employés" value={employees.data.length} variant={"dark"}/>}
        { user?.role !== "USER" && <StatisticCard title="Bulletins générés" value={487} advanced={{title:"Dernier bulletin", value: "Août"}}/>}
        { userHolidays.isSuccess && <StatisticCard title="Solde de congés" value={userHolidays.data.remainingDays} variant={"grey"} advanced={{title: "Année", value: userHolidays.data.year}}/>}
      </section>
    </div>
  )
}

export default Page