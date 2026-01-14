"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Modal } from "../Modal";

interface ModalOptions {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  body?: React.ReactNode;
  size?: string;
}

interface ModalContextType {
  modal: (options: ModalOptions) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ModalOptions | null>(null);

  const modal = (opts: ModalOptions) => {
    setOptions(opts);
    setOpen(true);
  };
  
  return (
    <ModalContext.Provider value={{ modal, open, setOpen }}>
      {children}
      <Modal
        open={open}
        onOpenChange={setOpen}
        title={options?.title}
        description={options?.description}
        body={options?.body}
        size={options?.size}
      />
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};
