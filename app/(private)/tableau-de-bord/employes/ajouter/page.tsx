"use client";

import EmployeeForm from "@/components/employee-form";
import ErrorComponent from "@/components/error-comp";
import LoadingComponent from "@/components/loading-comp";
import UserQuery from "@/queries/users";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const page = () => {
  const usersQuery = new UserQuery();
  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: ["employees"],
    queryFn: usersQuery.getAll,
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
      <EmployeeForm users={data} />
    </div>
  );
};

export default page;
