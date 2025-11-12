"use client";

import { ReactNode } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import PageLoader from "@/components/page-loader";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const { isReady, isAuthenticated } = useAuthGuard();

  // 1. Tant que Zustand n'est pas hydraté OU qu'on est en train de rediriger,
  //    on évite de flasher le contenu
  if (!isReady) {
    return <PageLoader/>
  }

  // 2. S'il n'est pas authentifié, le hook a déjà fait router.replace("/login")
  //    donc ici on retourne juste null.
  if (!isAuthenticated) {
    return null;
  }

  // 3. rendu normal de ta zone logguée
  return children
}