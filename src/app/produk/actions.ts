"use server";

import { createSKU } from "@/lib/createSku";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { getFilePath, removeFile, uploadFile } from "@/lib/uploadFile";
import { type Response } from "@/types/response";
import { formProductSchema } from "@/types/zod";
import { Product } from "@prisma/client";
import { existsSync } from "fs";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs";

export const addData = async (
  formdata: FormData
): Promise<Response<Product>> => {
  const raw = {
    name: formdata.get("name"),
    color: formdata.get("color"),
    fileName: formdata.get("fileName"),
    purchaseCost: JSON.parse(formdata.get("purchaseCost") as string),
    sellingPrice: JSON.parse(formdata.get("sellingPrice") as string),
    size: formdata.get("size"),
    stok: JSON.parse(formdata.get("stok") as string),
    notes: formdata.get("notes"),
  };

  const parseData = formProductSchema.safeParse(raw);

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid.",
      error: parseData.error,
    });
  const { data } = parseData;
  const file = formdata.get("fileName") as File | null;
  let fileName = "";
  let fileUrl = "";
  let filePreview = "";
  if (file) {
    const fileUpload = await uploadFile(file, "products");
    fileName = fileUpload.fileName;
    fileUrl = fileUpload.fileUrl;
    filePreview = fileUpload.fileUrl;
  } else {
    fileName = process.env.PREVIEW_IMAGE as string;
    fileUrl = process.env.PREVIEW_IMAGE_URL as string;
  }
  const sku = await createSKU(data.color, data.size);
  try {
    await prisma.product.create({
      data: {
        name: data.name,
        sku: sku,
        fileName: fileName,
        fileUrl: fileUrl,
        purchaseCost: data.purchaseCost,
        sellingPrice: data.sellingPrice,
        color: data.color,
        notes: data.notes,
        size: data.size,
        stok: data.stok,
      },
    });
    revalidatePath("/produk");
    return sendResponse({
      success: true,
      message: "Menambahkan data produk",
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
      message: "Menambahkan data produk",
    });
  }
};

export const updateData = async (
  id: string,
  formdata: FormData
): Promise<Response<Product>> => {
  const raw = {
    name: formdata.get("name"),
    color: formdata.get("color"),
    fileName: formdata.get("fileName"),
    purchaseCost: JSON.parse(formdata.get("purchaseCost") as string),
    sellingPrice: JSON.parse(formdata.get("sellingPrice") as string),
    size: formdata.get("size"),
    stok: JSON.parse(formdata.get("stok") as string),
    notes: JSON.parse(formdata.get("notes") as string),
  };

  const parseData = formProductSchema.safeParse(raw);

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid.",
      error: parseData.error,
    });
  const { data } = parseData;
  const dataInDb = await prisma.product.findUnique({ where: { id } });
  if (!dataInDb)
    return sendResponse({
      success: false,
      message: "Tidak ada data.",
      error: parseData.error,
    });
  const file = formdata.get("fileName") as File | null;

  let fileName = "";
  let fileUrl = "";
  let filePath = "";
  if (file && typeof file !== "string") {
    const fileUpload = await uploadFile(file, "products");
    fileName = fileUpload.fileName;
    fileUrl = fileUpload.fileUrl;
    filePath = getFilePath(fileUrl);
    if (
      dataInDb.fileName !== (process.env.PREVIEW_IMAGE as string) &&
      existsSync(filePath)
    ) {
      console.log("remove file");
      await removeFile(dataInDb.fileUrl as string);
    }
  } else {
    fileName = dataInDb.fileName ?? (process.env.PREVIEW_IMAGE as string);
    fileUrl = dataInDb.fileUrl ?? (process.env.PREVIEW_IMAGE_URL as string);
  }
  const sku = await createSKU(data.color, data.size);
  try {
    await prisma.product.update({
      data: {
        name: data.name,
        sku: sku,
        fileName: fileName,
        fileUrl: fileUrl,
        purchaseCost: data.purchaseCost,
        sellingPrice: data.sellingPrice,
        color: data.color,
        notes: data.notes,
        size: data.size,
        stok: data.stok,
      },
      where: { id },
    });
    revalidatePath("/produk");
    return sendResponse({
      success: true,
      message: "Mengedit data produk",
    });
  } catch (error) {
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
      message: "Mengedit data produk",
    });
  }
};
export const deleteData = async (id: string): Promise<Response<Product>> => {
  try {
    const dataInDb = await prisma.product.findUnique({ where: { id } });
    if (!dataInDb)
      return sendResponse({
        success: false,
        message: "Mendapatkan data produk",
      });
    await prisma.product.delete({ where: { id } });
    const filePath = getFilePath(dataInDb.fileUrl ?? "");
    if (
      dataInDb.fileName !== (process.env.PREVIEW_IMAGE as string) &&
      existsSync(filePath)
    ) {
      console.log("remove file");
      await removeFile(filePath);
    }
    revalidatePath("/produk");
    return sendResponse({
      success: true,
      message: "Menghapus data produk",
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Menghapus data produk",
    });
  }
};
