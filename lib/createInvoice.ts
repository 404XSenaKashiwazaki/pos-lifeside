import { prisma } from "@/lib/prisma";

export const createInvoice = async () => {
  const date = new Date();
  const formattedDate = date.toISOString().split("T")[0]; // 2025-11-21
  const lastInvoice = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: `INV-${formattedDate}` } },
    orderBy: { id: "desc" },
  });

  let nextNumber = 1;
  if (lastInvoice)
    nextNumber =
      parseInt(lastInvoice.invoiceNumber.split("-").pop() || "0") + 1;

  const paddedNumber = String(nextNumber).padStart(4, "0");

  return `INV-${formattedDate}-${paddedNumber}`;
};
