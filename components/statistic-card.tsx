// statistic-card.tsx
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

type StatisticCardVariant = "primary" | "dark" | "light";

export interface StatisticCardProps {
  title: string;
  value: number | string;
  footerText?: string;
  prefix?: string;
  suffix?: string;
  deltaPercent?: number;
  compareLabel?: string;
  compareValue?: number | string;
  formatValue?: (value: number | string) => string;
  formatCompareValue?: (value: number | string) => string;
  variant?: StatisticCardVariant;
  /** Active le mode skeleton */
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const variantClasses: Record<StatisticCardVariant, string> = {
  primary:
    "bg-gradient-to-r from-sky-600 to-blue-700 text-white border-0 shadow-sm",
  dark: "bg-neutral-900 text-white border-0 shadow-sm",
  light:
    "bg-white text-neutral-900 border border-neutral-200 shadow-sm",
};

const dividerClasses: Record<StatisticCardVariant, string> = {
  primary: "border-white/20 text-white/80",
  dark: "border-white/10 text-white/80",
  light: "border-neutral-200 text-neutral-500",
};

const smallTextClasses: Record<StatisticCardVariant, string> = {
  primary: "text-white/80",
  dark: "text-white/70",
  light: "text-neutral-500",
};

const formatNumberDefault = (value: number | string) =>
  typeof value === "number"
    ? value.toLocaleString("fr-FR")
    : String(value);

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  footerText,
  prefix = "",
  suffix = "",
  deltaPercent,
  compareLabel = "Vs last month:",
  compareValue,
  formatValue = formatNumberDefault,
  formatCompareValue = formatNumberDefault,
  variant = "primary",
  loading = false,
  children,
  className,
}) => {
  const dividerClass = dividerClasses[variant];
  const smallTextClass = smallTextClasses[variant];
  const hasCompare = typeof compareValue !== "undefined";

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl",
        variantClasses[variant],
        className
      )}
    >
      <CardHeader className="border-0 z-10 relative pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className={cn(
              "text-sm font-medium",
              variant === "light" ? "text-neutral-900" : "text-white/90"
            )}
          >
            {title}
          </CardTitle>

          {!loading && children && (
            <CardToolbar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "-me-1.5 h-7 w-7 rounded-full",
                      variant === "light"
                        ? "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom">
                  {children}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardToolbar>
          )}
        </div>
      </CardHeader>

      <CardContent className="z-10 relative space-y-2 pb-4">
        {/* Valeur principale + badge delta */}
        <div className="flex items-center gap-2.5">
          {loading ? (
            <>
              <Skeleton className="h-7 w-16 rounded-md" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </>
          ) : (
            <>
              <span
                className={cn(
                  "text-2xl font-semibold tracking-tight",
                  variant === "light" ? "text-neutral-900" : "text-white"
                )}
              >
                {typeof value === "number"
                  ? `${prefix}${formatValue(value)}${suffix}`
                  : value}
              </span>

              {typeof deltaPercent === "number" && (
                <Badge
                  className={cn(
                    "font-semibold flex items-center gap-1 text-xs border-0",
                    deltaPercent >= 0
                      ? "bg-emerald-500/90 text-white"
                      : "bg-red-500/90 text-white"
                  )}
                >
                  {deltaPercent >= 0 ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {Math.abs(deltaPercent)}%
                </Badge>
              )}
            </>
          )}
        </div>

        {/* Footer / comparaison */}
        {loading ? (
          <Skeleton className="h-3 w-24 mt-3" />
        ) : footerText ? (
          <div
            className={cn(
              "mt-1 pt-2 text-xs",
              "border-t",
              dividerClass,
              smallTextClass
            )}
          >
            {footerText}
          </div>
        ) : (
          hasCompare && (
            <div
              className={cn(
                "mt-1 pt-2 text-xs",
                "border-t",
                dividerClass,
                smallTextClass
              )}
            >
              {compareLabel}{" "}
              <span
                className={cn(
                  "font-medium",
                  variant === "light" ? "text-neutral-900" : "text-white"
                )}
              >
                {formatCompareValue(compareValue!)}
              </span>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};
