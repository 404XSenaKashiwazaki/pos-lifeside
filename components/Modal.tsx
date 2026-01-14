"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  body?: React.ReactNode;
  size?: string;
}

export function Modal({
  open,
  onOpenChange,
  title = "",
  description = "",
  body = "",
  size = "sm:max-w-md",
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent
    className={`${cn(size)} max-h-[90vh] overflow-hidden`}
  >
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    <div className="mt-4 overflow-y-auto max-h-[60vh] pr-1">
      {body}
    </div>
  </DialogContent>
</Dialog>

  );
}
