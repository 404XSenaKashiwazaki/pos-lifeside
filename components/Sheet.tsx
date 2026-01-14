"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  body?: React.ReactNode;
  size?: string;
}

const SheetComponent = ({
  open,
  onOpenChange,
  title = "",
  description = "",
  body = "",
  size = "w-full sm:max-w-lg",
}: ModalProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn(size)}>
        <SheetHeader>
          {title && <SheetTitle>{title}</SheetTitle>}
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="mt-3 px-4 h-screen overflow-y-scroll mb-5">{body}</div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetComponent;
