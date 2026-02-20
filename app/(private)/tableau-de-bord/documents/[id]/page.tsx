"use client";

import ErrorComponent from "@/components/error-comp";
import Header from "@/components/header";
import LoadingComponent from "@/components/loading-comp";
import { Input } from "@/components/ui/input";
import { filesData } from "@/data/temp";
import UserQuery from "@/queries/users";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);

  const usersQuery = new UserQuery();
  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: ["employees"],
    queryFn: usersQuery.getAll,
  });

 // 🔹 État pour la recherche
  const [search, setSearch] = useState("");

  // 🔹 Fichiers de cet employé uniquement
  const userFiles = filesData.filter((doc) => doc.userId === Number(id));

  // 🔹 Filtrage par nom
  const filteredFiles = userFiles.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <LoadingComponent />;
  if (isError) return <ErrorComponent description={(error as Error).message} />;
  if (!isSuccess || !data) return null;

  const user = data.find((user) => user.id === Number(id));

  return (
    <div className="grid gap-4 sm:gap-6">
      <Header variant={"primary"} title={`Fichiers de ${user?.firstName} ${user?.lastName}`} />

      {/* 🔹 Input de recherche */}
      <Input
        type="text"
        placeholder="Rechercher un fichier..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 w-full max-w-md ml-auto"
      />

      {/* 🔹 Grid des fichiers filtrés */}
      <div className="grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-5">
        {filteredFiles.map((doc, index) => (
          <div key={index}>
            <Link
              target="_blank"
              href={doc.url}
              className="flex flex-col items-center gap-2 cursor-pointer w-full hover:bg-gray-200 p-2 rounded-[12px]"
            >
              <img
                src={"/images/file.webp"}
                alt="folder"
                className="max-w-[109px] w-full h-auto aspect-auto"
              />
              <p className="max-w-[191px] w-full text-[18px] truncate text-center">
                {doc.title}
              </p>
            </Link>
          </div>
        ))}

        {/* 🔹 Message si aucun fichier ne correspond */}
        {filteredFiles.length === 0 && (
          <p className="col-span-full text-center text-gray-500 mt-4">
            Aucun fichier trouvé pour "{search}"
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
