"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { getFilePath, removeFile, uploadFile } from "@/lib/uploadFile";
import { type Response } from "@/types/response";
import { formCustomerSchema, formPaymentSchema } from "@/types/zod";
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
} from "@prisma/client";
import { existsSync } from "fs";
import { revalidatePath } from "next/cache";

export const addPayment = async (
  formdata: FormData
): Promise<Response<Payment>> => {
  const currentLogin = await auth();
  const raw = {
    notes: formdata.get("notes"),
    orderId: formdata.get("orderId"),
    paidAt: formdata.get("paidAt"),
    amount: JSON.parse(formdata.get("amount") as string),
    amountReturn: JSON.parse(formdata.get("amountReturn") as string),
    method: formdata.get("method"),
    type: formdata.get("type"),
    status: formdata.get("status"),
    reference: formdata.get("reference"),
  };

  const parseData = formPaymentSchema.safeParse(raw);
  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid",
      error: parseData.error,
    });
  const { data } = parseData;
  const file = formdata.get("reference") as File | null;
  let fileName = "";
  let fileUrl = "";
  if (file) {
    const fileUpload = await uploadFile(file, "payments");
    fileName = fileUpload.fileName;
    fileUrl = fileUpload.fileUrl;
  } else {
    fileName = process.env.PREVIEW_IMAGE as string;
    fileUrl = process.env.PREVIEW_IMAGE_URL as string;
  }

  try {
    await prisma.payment.create({
      data: {
        amount: data.amount,
        orderId: data.orderId,
        methodId: data.method,
        type: (data.type as PaymentType) || PaymentType.DP,
        status: (data.status as PaymentStatus) || PaymentStatus.PAID,
        paidAt: data.paidAt,
        processedBy: currentLogin?.user.id,
        reference: fileUrl,
        filename: fileName,
        amountReturn: data.amountReturn,
        notes: data.notes,
      },
    });

    await prisma.order.update({
      data: {
        status:
          (data.status as PaymentStatus) === "PAID"
            ? "CONFIRMED"
            : "PROCESSING",
      },
      where: {
        id: data.orderId,
      },
    });
    revalidatePath("/pembayaran");
    return sendResponse({
      success: true,
      message: "Menambahkan data pembayaran",
    });
  } catch (error) {
    const filePath = getFilePath(fileUrl);
    if (
      file &&
      fileName !== (process.env.PREVIEW_IMAGE as string) &&
      existsSync(filePath)
    ) {
      console.log("remove file");
      await removeFile(filePath);
    }
    
    return sendResponse({
      success: false,
      message: "Menambahkan data pembayaran",
    });
  }
};

export const updatePayment = async (
  id: string,
  formdata: FormData
): Promise<Response<Payment>> => {
  const raw = {
    notes: formdata.get("notes"),
    orderId: formdata.get("orderId"),
    paidAt: formdata.get("paidAt"),
    amount: JSON.parse(formdata.get("amount") as string),
    amountReturn: JSON.parse(formdata.get("amountReturn") as string),
    method: formdata.get("method"),
    type: formdata.get("type"),
    status: formdata.get("status"),
    reference: formdata.get("reference"),
  };

  const parseData = formPaymentSchema.safeParse(raw);
  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid",
      error: parseData.error,
    });
  const { data } = parseData;
  const file = formdata.get("reference") as File | null;
  let fileName = "";
  let fileUrl = "";

  const dataInDb = await prisma.payment.findUnique({ where: { id } });
  if (!dataInDb)
    return sendResponse({
      success: false,
      message: "Mendapatkan data pembayaran",
    });
  if (!file) {
    fileName = dataInDb.filename ?? (process.env.PREVIEW_IMAGE as string);
    fileUrl = dataInDb.reference ?? (process.env.PREVIEW_IMAGE_URL as string);
  } else {
    if (file instanceof File) {
      const filePath = getFilePath(dataInDb.reference ?? "");
      const fileUpload = await uploadFile(file, "payments");
      fileName = fileUpload.fileName;
      fileUrl = fileUpload.fileUrl;
      if (
        dataInDb.reference !== (process.env.PREVIEW_IMAGE as string) &&
        existsSync(filePath)
      ) {
        console.log("remove file");
        await removeFile(filePath);
      }
    } else {
      fileName = dataInDb.filename ?? (process.env.PREVIEW_IMAGE as string);
      fileUrl = dataInDb.reference ?? (process.env.PREVIEW_IMAGE_URL as string);
    }
  }

  console.log({kembalian: data.amountReturn});
  
  try {
    await prisma.payment.update({
      data: {
        amount: data.amount,
        orderId: data.orderId,
        methodId: data.method,
        type: (data.type as PaymentType) || PaymentType.DP,
        status: (data.status as PaymentStatus) || PaymentStatus.PAID,
        paidAt: data.paidAt,
        reference: fileUrl,
        filename: fileName,
        amountReturn: data.amountReturn,
        notes: data.notes,
      },
      where: { id },
    });
    await prisma.order.update({
      data: {
        status:
          (data.status as PaymentStatus) === "PAID"
            ? "CONFIRMED"
            : "PROCESSING",
      },
      where: {
        id: data.orderId,
      },
    });
    revalidatePath("/pembayaran");
    return sendResponse({
      success: true,
      message: "Mengupdate data pembayaran",
    });
  } catch (error) {
    const filePath = getFilePath(fileUrl);
    if (
      file &&
      (fileName !== (process.env.PREVIEW_IMAGE as string) ||
        dataInDb.reference !== (process.env.PREVIEW_IMAGE as string)) &&
      existsSync(filePath)
    ) {
      await removeFile(filePath);
      console.log("remove file");
    }
    
    return sendResponse({
      success: false,
      message: "Mengupdate data pembayaran",
    });
  }
};
export const deletePayment = async (id: string): Promise<Response<Payment>> => {
  try {
    const dataInDb = await prisma.payment.findUnique({ where: { id } });
    if (!dataInDb)
      return sendResponse({
        success: false,
        message: "Mendapatkan data pembayaran",
      });
    await prisma.payment.delete({ where: { id } });
    const filePath = getFilePath(dataInDb.reference);
    if (
      dataInDb.filename !== (process.env.PREVIEW_IMAGE as string) &&
      existsSync(filePath)
    ) {
      await removeFile(filePath);
      console.log("remove file");
    }
    revalidatePath("pembayaran");
    return sendResponse({
      success: true,
      message: "Menghapus data pembayaran",
    });
  } catch (error) {
    

    return sendResponse({
      success: false,
      message: "Menghapus data pembayaran",
    });
  }
};
