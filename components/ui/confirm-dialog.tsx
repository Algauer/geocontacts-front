"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isPending?: boolean;
  variant?: "default" | "destructive";
  children: React.ReactNode;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  isPending = false,
  variant = "default",
  children,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[1px]" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-white p-5 shadow-xl">
          <AlertDialog.Title className="text-base font-semibold text-foreground">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm text-muted-foreground">
            {description}
          </AlertDialog.Description>

          <div className="mt-5 flex items-center justify-end gap-2">
            <AlertDialog.Cancel
              disabled={isPending}
              className="inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              {cancelLabel}
            </AlertDialog.Cancel>

            <AlertDialog.Action
              onClick={onConfirm}
              disabled={isPending}
              className={cn(
                "inline-flex h-9 min-w-24 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors disabled:opacity-50",
                variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : confirmLabel}
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
