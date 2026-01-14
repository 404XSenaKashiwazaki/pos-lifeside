"use server";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { type Response } from "@/types/response";
import { formPaymentMethodsSchema } from "@/types/zod";
import { Customer, PaymentMethods, User } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const storeData = async (
  formdata: FormData
): Promise<Response<PaymentMethods>> => {
  const parseData = await formPaymentMethodsSchema.safeParseAsync({
    name: formdata.get("name"),
    no: JSON.parse(formdata.get("no") as string),
    description: formdata.get("description"),
  });

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid",
      error: parseData.error,
    });
  const { data } = parseData;
  try {
    await prisma.paymentMethods.create({
      data: { ...data },
    });
    revalidatePath("/metode-pembayaran");
    return sendResponse({
      success: true,
      message: "Menambahkan data metode pembayaran",
    });
  } catch (error) {

    return sendResponse({
      success: false,
      message: "Menambahkan data metode pembayaran",
    });
  }
};

export const updateData = async (id: string, formdata: FormData) => {
  const parseData = formPaymentMethodsSchema.safeParse({
    name: formdata.get("name"),
    no: JSON.parse(formdata.get("no") as string),
    description: formdata.get("description"),
  });
  
  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid",
      error: parseData.error,
    });
  try {
    const userInDb = await prisma.paymentMethods.findUnique({ where: { id } });
    if (!userInDb)
      return sendResponse({
        success: false,
        message: "Mendapatkan data metode pembayaran",
      });
    const { data } = parseData;
    await prisma.paymentMethods.update({ data: { ...data }, where: { id } });
    revalidatePath("/metode-pembayaran");
    return sendResponse({
      success: true,
      message: "Mengupdate data metode pembayaran",
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Mengupdate data metode pembayaran",
    });
  }
};
export const deleteData = async (
  id: string
): Promise<Response<PaymentMethods>> => {
  try {
    const userInDb = await prisma.paymentMethods.findUnique({ where: { id } });
    if (!userInDb)
      return sendResponse({
        success: false,
        message: "Mendapatkan data metode pembayaran",
      });
    await prisma.paymentMethods.delete({ where: { id } });
    revalidatePath("metode-pembayaran");
    return sendResponse({
      success: true,
      message: "Menghapus data metode pembayaran",
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Menghapus data metode pembayaran",
    });
  }
};
