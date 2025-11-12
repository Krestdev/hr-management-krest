// hooks/useAuthGuard.ts
"use client";

import useKizunaStore from "@/context/store";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/data/config";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();

  // on lit Zustand
  const user = useKizunaStore((s) => s.user);
  const token = useKizunaStore((s) => s.token);
  const isHydrated = useKizunaStore((s) => s.isHydrated);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    // tant que Zustand n'a pas fini sa réhydratation depuis sessionStorage,
    // on fait rien du tout
    if (!isHydrated) return;

    const isLoggedIn = Boolean(user && token);
    const isPublic = PUBLIC_ROUTES.includes(pathname);
    const isProtected = PROTECTED_ROUTES.includes(pathname);

    // Cas 1 : page privée et user pas loggé ⇒ go /login
    if (isProtected && !isLoggedIn) {
      router.replace(`/connexion?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Cas 2 : page publique mais user déjà loggé ⇒ go /dashboard
    if (isPublic && isLoggedIn) {
      router.replace("/tableau-de-bord");
      return;
    }

    // si on arrive ici : on est autorisé à voir la page courante
    setReady(true);
  }, [isHydrated, pathname, router, user, token]);

  return {
    isReady: ready, // true seulement quand on peut afficher la page
    isAuthenticated: Boolean(user && token),
    user,
    token,
  };
}