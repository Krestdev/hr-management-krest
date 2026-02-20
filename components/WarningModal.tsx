"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Variant = "error" | "success" | "warning";

type WarningModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  action: () => void;
  variant?: Variant;
  actionLabel?: string;
  cancelLabel?: string;
};

const variantStyles: Record<Variant, {
  icon: string;
  buttonVariant: "default" | "destructive" | "link" | "primary" | "outline" | "secondary" |"ghost" | "accent" | "delete" | null | undefined;

  iconColor: string;
}> = {
  error: {
    icon: "❌",
    buttonVariant: "destructive",
    iconColor: "text-red-500",
  },
  success: {
    icon: "✅",
    buttonVariant: "primary",
    iconColor: "text-green-500",
  },
  warning: {
    icon: "⚠️",
    buttonVariant: "accent",
    iconColor: "text-yellow-500",
  },
};

const WarningModal: React.FC<WarningModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  action,
  variant = "warning",
  actionLabel = "Confirmer",
  cancelLabel = "Annuler",
}) => {
  const styles = variantStyles[variant];

  const handleAction = () => {
    action();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-2">
            <span className={cn("text-4xl", styles.iconColor)}>
              {styles.icon}
            </span>
            <DialogTitle className="text-center">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-center">
                {description}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>
        
        <DialogFooter className="flex flex-row justify-center gap-2 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
          
          <Button
            type="button"
            variant={styles.buttonVariant}
            onClick={handleAction}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarningModal;