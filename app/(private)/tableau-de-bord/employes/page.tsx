'use client'
import ErrorComponent from '@/components/error-comp'
import Header from '@/components/header'
import LoadingComponent from '@/components/loading-comp'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useKizunaStore from '@/context/store'
import { formatSalary, getYearsOfService } from '@/lib/utils'
import UserQuery from '@/queries/users'
import { AddSquareIcon, UserAccountIcon, UserBlock02Icon, UserEdit01Icon, UserGroupIcon, UserRemove01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useQuery } from '@tanstack/react-query'
import { EllipsisIcon } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import ViewProfile from './view-profile'
import { Employee } from '@/types/types'

type LengthOfService = "all" | "less1" | "1to3" | "3to5" | "5to10" | "over10";


function formatSeniority(startDate: Date | string): string {
const years = getYearsOfService(startDate);

if (years < 1) return "Moins d'un an";
if (years < 2) return "1 an";
if (years < 3) return "2 ans";
if (years < 5) return `${Math.floor(years)} ans`;
if (years < 10) return "Entre 5 et 10 ans";
return "Plus de 10 ans";
}

function matchYearsFilter(startDate: Date | string, filter: LengthOfService): boolean {
if (filter === "all") return true;
const years = getYearsOfService(startDate);

switch (filter) {
  case "less1":
    return years < 1;
  case "1to3":
    return years >= 1 && years < 3;
  case "3to5":
    return years >= 3 && years < 5;
  case "5to10":
    return years >= 5 && years < 10;
  case "over10":
    return years >= 10;
  default:
    return true;
}
}

function Page() {
  const { user } = useKizunaStore();
  const usersQuery = new UserQuery();
  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: ["employees"],
    queryFn: usersQuery.getAll
  });

  const [departments, setDepartments] = useState<Array<string>>([]);
  const [selected, setSelected] = useState<Employee>();
  const [openProfile, setOpenProfile] = useState(false);
  const [viewEdit, setViewEdit] = useState(false);
  const [viewSuspend, setViewSuspend] = useState(false);
  const [viewDelete, setViewDelete] = useState(false);

  function viewSelected (e:Employee):void{
    setSelected(e);
    setOpenProfile(true);
  }
  function editSelected (e:Employee):void{
    setSelected(e);
    setViewEdit(true);
  }
  function suspendSelected (e:Employee):void{
    setSelected(e);
    setViewSuspend(true);
  }
  function deleteSelected (e:Employee):void{
    setSelected(e);
    setViewDelete(true);
  }

  useEffect(()=>{
    if (isSuccess && data) {
      const uniqueDepartments = Array.from(
        new Set(
          data
            .map((user) => user.department)
            .filter(Boolean)
        )
      );
      setDepartments(uniqueDepartments);
    }
  },[isSuccess, data]);

  const [searchValue, setSearchValue] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [years, setYears] = useState<LengthOfService>("all");

  function resetFilters(){
    setSearchValue("");
    setDepartmentFilter("all");
    setYears("all");
  }

  const filteredData = useMemo(() => {
    if (!isSuccess || !data) return [];

    return data
      .filter((employee) => {
        // recherche sur nom + prénom
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        const query = searchValue.trim().toLowerCase();
        const matchSearch = query === "" || fullName.includes(query);

        // filtre département
        const matchDepartment =
          departmentFilter === "all" ||
          employee.department === departmentFilter;

        // filtre ancienneté
        const matchYears = matchYearsFilter(employee.startDate, years);

        return matchSearch && matchDepartment && matchYears;
      })
      .sort((a, b) =>
        a.lastName.localeCompare(b.lastName, "fr", { sensitivity: "base" })
      );
  }, [isSuccess, data, searchValue, departmentFilter, years]);

  if(isLoading){
    return <LoadingComponent/>
  }
  if(isError){
    return <ErrorComponent description={error.message}/>
  }
  if(!isSuccess){
    return null;
  }
  return (
    <div className="grid gap-4 sm:gap-6">
      <Header title="Gestion des Employés" variant={"primary"} />
      <div className="card-1">
        <div className="card-1-header2">
          <h3>{"Liste des employés"}</h3>
          <div className="filters">
            <div className="filter-group">
              <Input
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                type="search"
                placeholder="Rechercher par nom"
                className="min-w-60"
              />
            </div>
            <div className="filter-group">
              <Label htmlFor="department">{"Département"}</Label>
              <Select
                name="department"
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="min-w-32">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous"}</SelectItem>
                  {departments.map((item, id) => (
                    <SelectItem key={id} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="filter-group">
              <Label htmlFor="years">{"Ancienneté"}</Label>
              <Select
                name="years"
                value={years}
                onValueChange={(val) => setYears(val as LengthOfService)}
              >
                <SelectTrigger className="min-w-32">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous"}</SelectItem>
                  <SelectItem value="less1">{"Moins d'1 an"}</SelectItem>
                  <SelectItem value="1to3">{"1 à 3 ans"}</SelectItem>
                  <SelectItem value="3to5">{"3 à 5 ans"}</SelectItem>
                  <SelectItem value="5to10">{"5 à 10 ans"}</SelectItem>
                  <SelectItem value="over10">{"Plus de 10 ans"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{"Noms"}</TableHead>
              <TableHead>{"Poste"}</TableHead>
              <TableHead>{"Département"}</TableHead>
              <TableHead>{"Ancienneté"}</TableHead>
              <TableHead>{"Salaire de base"}</TableHead>
              <TableHead>{"Actions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-6">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant={"icon"}>
                        <HugeiconsIcon icon={UserGroupIcon} />
                      </EmptyMedia>
                      <EmptyTitle>{"Aucun employé trouvé"}</EmptyTitle>
                      <EmptyDescription>
                        {data.length === 0
                          ? "Aucun employé enregistré. Commencez par ajouter un employé pour l'afficher dans cette liste."
                          : "Aucun employé correspondant à votre recherche."}
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      {
                        data.length !== 0 &&
                        <Button variant={"outline"} onClick={resetFilters}>{"Réinitialiser les filtres"}</Button>
                      }
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{formatSeniority(employee.startDate)}</TableCell>
                  <TableCell>{formatSalary(employee.baseSalary)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size={"icon"} variant={"ghost"}>
                          <EllipsisIcon/>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={()=>viewSelected(employee)}>
                          <HugeiconsIcon icon={UserAccountIcon} />{"Voir le profil"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <HugeiconsIcon icon={UserEdit01Icon} />{"Modifier le profil"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <HugeiconsIcon icon={AddSquareIcon} />{"Ajouter le DIPE"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <HugeiconsIcon icon={UserBlock02Icon} />{"Suspendre"}
                        </DropdownMenuItem>
                        {
                          user?.role === "MANAGER" &&
                          <DropdownMenuItem variant="destructive">
                          <HugeiconsIcon icon={UserRemove01Icon} />{"Supprimer"}
                        </DropdownMenuItem>
                        }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {
        selected &&
        <ViewProfile isOpen={openProfile} openChange={setOpenProfile} employee={selected} users={data}/>
      }
    </div>
  )
}

export default Page