"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import SheetComponent from "../Sheet";

interface openSheetProps {
  content: ReactNode;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  size?: string;
}
type SheetContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sheet: (opt: openSheetProps) => void;
};

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function SheetProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<openSheetProps | null>(null);

  const sheet = (options: openSheetProps) => {
    setOptions(options);
    setOpen(true);
  };

  return (
    <SheetContext.Provider value={{ sheet, open, setOpen }}>
      {children}
      <SheetComponent
        open={open}
        onOpenChange={setOpen}
        title={options?.title}
        body={options?.content}
        description={options?.description}
        size={options?.size}
      />
    </SheetContext.Provider>
  );
}

export const useSheet = () => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a SheetProvider");
  }
  return context;
};
