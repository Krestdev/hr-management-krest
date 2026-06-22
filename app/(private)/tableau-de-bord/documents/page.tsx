"use client";

import Header from "@/components/header";
import useKizunaStore from "@/context/store";
import { useEmployeesQuery } from "@/queries/employee";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import LoadingComponent from "@/components/loading-comp";
import ErrorComponent from "@/components/error-comp";

const Page = () => {
  const { user } = useKizunaStore();
  const router = useRouter();

  const { data, isSuccess, isLoading, isError, error } = useEmployeesQuery(1, 20, "");

  // 🔁 Redirection auto si USER → ses documents directement
  useEffect(() => {
    if (user?.role === "USER") {
      router.replace(`/tableau-de-bord/documents/${user.uuid}`);
    }
  }, [user, router]);

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent description={(error as Error).message} />;
  if (!isSuccess || !data) return null;

  // ⚠️ USER ne voit pas la page
  if (user?.role === "USER") return null;

  return (
    <div className="grid gap-4 sm:gap-6">
      <Header variant="primary" title="Employés" />

      {/* 🔹 Grid des utilisateurs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-5">
        {data.data.map((emp) => (
          <Link
            key={emp.uuid}
            href={`/tableau-de-bord/documents/${emp.uuid}`}
            className="flex flex-col items-center gap-2 cursor-pointer w-full hover:bg-gray-200 p-3 rounded-[14px]"
          >
            <img
              src="/images/folder.webp"
              alt="user"
              className="max-w-[120px] w-full h-auto"
            />
            <p className="text-[17px] font-medium truncate text-center">
              {emp.firstName} {emp.lastName}
            </p>
            <span className="text-[13px] text-gray-500">
              {emp.email}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
