"use server";
import { createSKU } from "@/lib/createSku";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { getFilePath, removeFile, uploadFile } from "@/lib/uploadFile";
import { type Response } from "@/types/response";
import {
  formCustomerSchema,
  formProductSchema,
  formSizeSchema,
} from "@/types/zod";
import { Customer, Product, Size, User } from "@prisma/client";
import { existsSync } from "fs";
import { revalidatePath } from "next/cache";

export const addData = async (formdata: FormData): Promise<Response<Size>> => {
  const raw = {
    name: formdata.get("name"),
    chest: JSON.parse(formdata.get("chest") as string),
    length: JSON.parse(formdata.get("length") as string),
    sleeve: JSON.parse(formdata.get("sleeve") as string),
    note: JSON.parse(formdata.get("note") as string),
  };

  const parseData = formSizeSchema.safeParse(raw);

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid.",
      error: parseData.error,
    });
  const { data } = parseData;

  try {
    await prisma.size.create({
      data: { ...data },
    });
    revalidatePath("/ukuran-produk");
    return sendResponse({
      success: true,
      message: "Menambahkan data ukuran produk",
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Menambahkan data ukuran produk",
    });
  }
};

export const updateData = async (
  id: string,
  formdata: FormData
): Promise<Response<Size>> => {
  const raw = {
    name: formdata.get("name"),
    chest: JSON.parse(formdata.get("chest") as string),
    length: JSON.parse(formdata.get("length") as string),
    sleeve: JSON.parse(formdata.get("sleeve") as string),
    note: JSON.parse(formdata.get("note") as string),
  };

  const parseData = formSizeSchema.safeParse(raw);

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid.",
      error: parseData.error,
    });
  const { data } = parseData;
  const dataInDb = await prisma.size.findUnique({ where: { id } });
  if (!dataInDb)
    return sendResponse({
      success: false,
      message: "Tidak ada data.",
      error: parseData.error,
    });
  try {
    await prisma.size.update({
      data: { ...data },
      where: { id },
    });
    revalidatePath("/ukuran-produk");
    return sendResponse({
      success: true,
      message: "Mengedit data ukuran produk",
    });
  } catch (error) {

    return sendResponse({
      success: false,
      message: "Mengedit data ukuran produk",
    });
  }
};
export const deleteData = async (id: string): Promise<Response<Size>> => {
  try {
    const userInDb = await prisma.size.findUnique({ where: { id } });
    if (!userInDb)
      return sendResponse({
        success: false,
        message: "Mendapatkan data ukuran produk",
      });
    await prisma.size.delete({ where: { id } });
    revalidatePath("/ukuran-produk");
    return sendResponse({
      success: true,
      message: "Menghapus data ukuran produk",
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Menghapus data ukuran produk",
    });
  }
};
