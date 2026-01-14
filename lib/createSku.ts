import { prisma } from "@/lib/prisma";

export const createSKU = async (color: string, size: string) => {
  const colorCode = color.split(" ")[0].toUpperCase();
  const lastProduct = await prisma.product.findFirst({
    orderBy: { createdAt: "desc" },
  });
  let lastNumber = 0;
  if (lastProduct?.sku) {
    const parts = lastProduct.sku.split("-");
    const num = parts[2];
    lastNumber = parseInt(num) || 0;
  }
  const nextNumber = (lastNumber + 1).toString().padStart(5, "0");
  return `${colorCode}-${size}-${nextNumber}`;
};
