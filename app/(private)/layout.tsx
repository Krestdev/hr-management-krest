"use client";

import { ReactNode } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import PageLoader from "@/components/page-loader";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const { isReady, isAuthenticated } = useAuthGuard();

  if (!isReady) {
    return <PageLoader/>
  }

  if (!isAuthenticated) {
    return null;
  } //Toogle this to redo the route protection
  return children
}