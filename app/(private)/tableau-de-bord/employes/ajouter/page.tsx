"use client";

import EmployeeForm from "@/components/employee-form";
import ErrorComponent from "@/components/error-comp";
import LoadingComponent from "@/components/loading-comp";
import useKizunaStore from "@/context/store";
import UserQuery from "@/queries/employee";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const { user } = useKizunaStore();
  const usersQuery = new UserQuery();

  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: ["employees", "add", user?.companyId],
    queryFn: () => usersQuery.getAll(
      1,
      100,
      user?.companyId || "",
      "",
      "",
      "ACTIVE",
      "",
      true,
      true
    ),
    enabled: !!user?.companyId,
  });

  if (isLoading) {
    return <LoadingComponent />;
  }
  if (isError) {
    return <ErrorComponent description={error.message} />;
  }
  if (!isSuccess) {
    return null;
  }

  return (
    <div className="max-w-[800px] grid gap-4">
      <EmployeeForm users={data.data} />
    </div>
  );
};

export default Page;