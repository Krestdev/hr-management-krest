import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";

const cardVariants = cva("w-full p-5 flex flex-col gap-2 border rounded-lg", {
  variants: {
    variant: {
      primary:
        "bg-linear-to-l from-primary-400 to-primary-700 text-white border-primary-400",
      default: "bg-white text-gray-900 border-gray-200",
      dark: "bg-neutral-900 text-white border-neutral-700",
      grey: "bg-[#4D5766] text-white border-[#878887]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface Props {
  className?: string;
  children?: React.ReactNode;
  title: string;
  value: number | string;
  advanced?: { title?: string; value: string | number };
}

function StatisticCard({
  className,
  variant,
  title,
  children,
  value,
  advanced,
}: Props & VariantProps<typeof cardVariants>) {
  return (
    <div className={cn(cardVariants({ variant, className }))}>
      <div className="w-full flex items-center gap-2 justify-between min-h-10">
        <span
          className={cn(
            "text-sm leading-[150%] font-medium",
            variant === "default"
                ? "text-gray-700"
                : !variant
                ? "text-gray-700"
                : "text-gray-200"
          )}
        >
          {title}
        </span>
        {children && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <HugeiconsIcon icon={MoreHorizontalIcon} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>{children}</DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <span className="text-[32px] leading-[120%] tracking-[-2%] font-medium">
        {value}
      </span>
      {advanced && (
        <>
          <hr
            className={cn(
              "w-full",
              !variant
                ? "border-neutral-200"
                : variant === "default"
                ? "border-neutral-200"
                : variant === "dark"
                ? "border-neutral-500"
                : variant === "grey"
                ? "border-neutral-400"
                : "border-primary-200"
            )}
          />
          <p
            className={cn(
              "text-[12px] leading-[150%]",
              variant === "default"
                ? "text-gray-700"
                : !variant
                ? "text-gray-700"
                : "text-gray-200"
            )}
          >
            {advanced.title && `${advanced.title}: `}
            <strong>{advanced.value}</strong>
          </p>
        </>
      )}
    </div>
  );
}

export default StatisticCard;
