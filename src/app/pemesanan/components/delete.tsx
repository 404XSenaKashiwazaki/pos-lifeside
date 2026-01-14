"use client";

import { Button } from "@/components/ui/button";
import { Trash2Icon, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {  deleteOrder } from "../actions";
import { Spinner } from "@/components/ui/spinner";

interface DeleteModalProps {
  id: string;
  setOpen: (value: React.SetStateAction<boolean>) => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ setOpen, id }) => {
  const [loading, setLoading] = useState(false);
  const deleteData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { success, message, error } = await deleteOrder(id);
      if (success) {
        setOpen(false);
        toast("Sukses", {
          description: message,
          position: "top-right",
          closeButton: true,
        });
      }
      if (error) {
        toast.error("Ops...");
      }
    } catch (error) {
      toast.error("Ops...");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        variant="outline"
        size={"sm"}
        disabled={loading}
        onClick={() => setOpen(false)}
      >
        <X />
        Batal
      </Button>
      <Button
        variant="destructive"
        size={"sm"}
        disabled={loading}
        onClick={() => deleteData()}
      >
        {loading ? (
          <div className="flex gap-1 items-center">
            <Spinner className="size-3" />
            Loading...
          </div>
        ) : (
          <div className="flex gap-1 items-center">
            <Trash2Icon /> Hapus
          </div>
        )}
      </Button>
    </div>
  );
};

export default DeleteModal;
