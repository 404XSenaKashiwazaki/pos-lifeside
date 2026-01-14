"use server";

import { User } from "@prisma/client";
import { prisma } from "./prisma";

export const findDataPaymentByNo = async (no: number) => {
  const indDb = await prisma.paymentMethods.findFirst({
    where: { no },
  });
  return indDb;
};

export const findDataPaymentByName = async (name: string) => {
  const indDb = await prisma.paymentMethods.findFirst({
    where: { name },
  });
  return indDb;
};

export const findDataProductById = async (id: string) => {
  const indDb = await prisma.product.findFirst({
    where: { id },
  });
  return indDb;
};

export const findDataUserByEmail = async (
  email: string
): Promise<{ email: string | null } | null> => {
  const indDb = await prisma.user.findUnique({
    where: { email },
    select: { email: true },
  });
  return indDb;
};
