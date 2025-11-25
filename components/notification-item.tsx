"use client";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/types";
import {
  CalendarUserIcon,
  InformationSquareIcon,
  LocationUser04Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import { formatRelative } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./ui/button";

type Props = Notification & {
  onMarkAsRead?: (id: number) => void;
};

function NotificationItem({
  id,
  status,
  statusType,
  type = "DEFAULT",
  description,
  createdAt,
  title,
  onMarkAsRead,
}: Props) {
  const [hovered, setHovered] = useState(false);

  const getIcon = (value: Notification["type"]): IconSvgElement => {
    switch (value) {
      case "DEFAULT":
        return InformationSquareIcon;
      case "IS_AWAY":
        return LocationUser04Icon;
      case "LEAVE_REQUEST":
        return CalendarUserIcon;
      default:
        return InformationSquareIcon;
    }
  };

  const iconStyle = (type: Notification["statusType"]): string => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-600";
      case "error":
        return "bg-red-100 text-red-600";
      case "success":
        return "bg-green-100 text-green-600";
      case "warning":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <motion.div
      layout
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={cn(
        "max-w-5xl w-full rounded-lg min-h-16 px-4 py-2 flex flex-col justify-center gap-2 transition-colors duration-200 ease-out",
        status === "UNREAD"
          ? "bg-white hover:bg-neutral-50"
          : "bg-neutral-100"
      )}
    >
      <div className="flex justify-between gap-3 items-center">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "size-8 flex items-center justify-center rounded-md shrink-0",
              iconStyle(statusType)
            )}
          >
            <HugeiconsIcon icon={getIcon(type)} size={20} />
          </span>
          <div>
            <h5 className="text-sm font-semibold">{title}</h5>
            <p className="text-slate-600 text-sm">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-xs">
            {formatRelative(new Date(createdAt), new Date(), {
              locale: fr,
            })}
          </span>
        </div>
      </div>

      {status === "UNREAD" && (
        <motion.div
          // on joue sur la hauteur + opacité, sans laisser d’espace
          initial={false}
          animate={
            hovered
              ? { height: "auto", opacity: 1 }
              : { height: 0, opacity: 0 }
          }
          transition={{ duration: 0.3 }}
          style={{ overflow: "hidden" }}
        >
          <Button
            size={"sm"}
            variant={"outline"}
            className="text-xs"
            onClick={() => onMarkAsRead?.(id)}
          >
            {"Marquer comme lu"}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default NotificationItem;
