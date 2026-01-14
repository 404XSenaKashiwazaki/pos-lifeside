"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { getFilePath, removeFile, uploadFile } from "@/lib/uploadFile";
import { type Response } from "@/types/response";
import {
  formProductionSchema,
} from "@/types/zod";
import { Payment, Production, ProductionStatus } from "@prisma/client";

import { existsSync } from "fs";
import { revalidatePath } from "next/cache";

export const updateProduction = async (
  id: string,
  formdata: FormData
): Promise<Response<Production>> => {
  const raw = {
    notes: formdata.get("notes"),
    assignedToId: formdata.get("assignedToId"),
    endDate: formdata.get("endDate"),
    orderItemId: formdata.get("orderItemId"),
    startDate: formdata.get("startDate"),
    progress: formdata.get("progress"),
    status: formdata.get("status"),
    sablonTypeId: formdata.get("sablonTypeId"),
  };

  const parseData = formProductionSchema.safeParse(raw);

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data produksi",
      error: parseData.error,
    });
  const { data } = parseData;
  const file = formdata.get("filename") as File | null;
  let fileName = "";
  let fileUrl = "";

  const dataInDb = await prisma.production.findUnique({ where: { id } });
  if (!dataInDb)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data produksi",
    });
  if (!file) {
    fileName = dataInDb.filename ?? (process.env.PREVIEW_IMAGE as string);
    fileUrl =
      dataInDb.fileProofUrl ?? (process.env.PREVIEW_IMAGE_URL as string);
  } else {
    if (file instanceof File) {
      const filePath = getFilePath(dataInDb.fileProofUrl ?? "");
      const fileUpload = await uploadFile(file, "productions");
      fileName = fileUpload.fileName;
      fileUrl = fileUpload.fileUrl;
      if (
        dataInDb.filename !== (process.env.PREVIEW_IMAGE as string) &&
        existsSync(filePath) && dataInDb.fileProofUrl
      ) {
        console.log("remove file");
        await removeFile(filePath);
      }
    } else {
      fileName = dataInDb.filename ?? (process.env.PREVIEW_IMAGE as string);
      fileUrl =
        dataInDb.fileProofUrl ?? (process.env.PREVIEW_IMAGE_URL as string);
    }
  }
  try {
    await prisma.production.update({
      data: {
        orderItemId: data.orderItemId,
        status: (data.status as ProductionStatus) || ProductionStatus.WAITING,
        assignedToId: data.assignedToId,
        startDate: data.startDate,
        endDate: data.endDate,
        sablonTypeId: data.sablonTypeId,
        progress: Number(data.progress),
        fileProofUrl: fileUrl,
        notes: data.notes,
        filename: fileName,
      },
      where: {
        id,
      },
    });
    revalidatePath("/produksi");
    return sendResponse({
      success: true,
      message: "Berhasil mengupdate data produksi",
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
    console.log({ error });
    return sendResponse({
      success: false,
      message: "Gagal mengupdate data produksi",
    });
  }
};

export const updatePayment = async (
  id: string,
  formdata: FormData
): Promise<Response<Payment>> => {
  const raw = {
    notes: formdata.get("notes"),
    assignedToId: formdata.get("assignedToId"),
    endDate: formdata.get("endDate"),
    orderItemId: formdata.get("orderItemId"),
    startDate: formdata.get("startDate"),
    progress: formdata.get("progress"),
    status: formdata.get("status"),
    sablonTypeId: formdata.get("sablonTypeId"),
  };

  const parseData = formProductionSchema.safeParse(raw);
  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data produksi",
      error: parseData.error,
    });
  const { data } = parseData;
  const file = formdata.get("filename") as File | null;
  let fileName = "";
  let fileUrl = "";
  const dataInDb = await prisma.production.findUnique({ where: { id } });
  if (!dataInDb)
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data produksi",
    });
  if (!file) {
    fileName = dataInDb.filename ?? (process.env.PREVIEW_IMAGE as string);
    fileUrl = dataInDb.fileProofUrl ?? (process.env.PREVIEW_IMAGE_URL as string);
  } else {
    if (file instanceof File) {
      const filePath = getFilePath(dataInDb.fileProofUrl ?? "");
      const fileUpload = await uploadFile(file, "produksi");
      fileName = fileUpload.fileName;
      fileUrl = fileUpload.fileUrl;
      if (
        dataInDb.fileProofUrl !== (process.env.PREVIEW_IMAGE as string) &&
        existsSync(filePath)
      ) {
        console.log("remove file");
        await removeFile(filePath);
      }
    } else {
      fileName = dataInDb.filename ?? (process.env.PREVIEW_IMAGE as string);
      fileUrl = dataInDb.fileProofUrl ?? (process.env.PREVIEW_IMAGE_URL as string);
    }
  }

  try {
    await prisma.production.update({
      data: {
        orderItemId: data.orderItemId,
        status: (data.status as ProductionStatus) || ProductionStatus.WAITING,
        assignedToId: data.assignedToId,
        startDate: data.startDate,
        endDate: data.endDate,
        sablonTypeId: data.sablonTypeId,
        progress: Number(data.progress),
        fileProofUrl: fileUrl,
        notes: data.notes,
        filename: fileName,
      },
      where: { id },
    });
    revalidatePath("/produksi");
    return sendResponse({
      success: true,
      message: "Berhasil mengupdate data produksi",
    });
  } catch (error) {
    const filePath = getFilePath(fileUrl);
    if (
      file &&
      (fileName !== (process.env.PREVIEW_IMAGE as string) ||
        dataInDb.fileProofUrl !== (process.env.PREVIEW_IMAGE as string)) &&
      existsSync(filePath)
    ) {
      await removeFile(filePath);
      console.log("remove file");
    }
    console.log({ error });
    return sendResponse({
      success: false,
      message: "Gagal mengupdate data produksi",
    });
  }
};
export const deleteProduction = async (
  id: string
): Promise<Response<Production>> => {
  try {
    const dataInDb = await prisma.production.findUnique({ where: { id } });
    if (!dataInDb)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data produksi",
      });
    await prisma.production.delete({ where: { id } });
    const filePath = getFilePath(dataInDb.fileProofUrl ?? "");
    if (
      dataInDb.filename !== (process.env.PREVIEW_IMAGE as string) &&
      existsSync(filePath)
    ) {
      await removeFile(filePath);
      console.log("remove file");
    }
    revalidatePath("produksi");
    return sendResponse({
      success: true,
      message: "Berhasil menghapus data produksi",
    });
  } catch (error) {
    console.log({ error });

    return sendResponse({
      success: false,
      message: "Gagal menghapus data produksi",
    });
  }
};
