"use client";
import { Alert01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

interface Props {
  title?: string;
  description?: string;
}

function ErrorComponent({ title, description }: Props) {
  return (
    <div className="w-full min-h-[60vh] py-10 sm:py-14 lg:py-24 flex flex-col text-center items-center justify-center gap-2">
      <span className="size-10 rounded-md bg-red-200 text-destructive flex items-center justify-center">
        <HugeiconsIcon icon={Alert01Icon} />
      </span>
      <h1 className="text-destructive">
        {title ?? "Une erreur s'est produite"}
      </h1>
      <p className="max-w-xl text-slate-600">
        {
          "Nous avons rencontré une erreur pendant le chargement de votre page. Veuillez actualiser, si le problème persiste bien vouloir vous rapprocher du support"
        }
      </p>
      {description && <span className="text-sm max-w-lg">{description}</span>}
    </div>
  );
}

export default ErrorComponent;
