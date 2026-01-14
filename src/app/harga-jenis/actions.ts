"use server";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { type Response } from "@/types/response";
import { formHargaJenisSchema } from "@/types/zod";
import { SablonType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addHargaJenis = async (
  formdata: FormData
): Promise<Response<SablonType>> => {
  const raw = {
    name: formdata.get("name"),
    description: formdata.get("description"),
    basePrice: JSON.parse(formdata.get("basePrice") as string),
    pricePerColor: JSON.parse(formdata.get("pricePerColor") as string),
    pricePerArea: JSON.parse(formdata.get("pricePerArea") as string),
    baseCost: JSON.parse(formdata.get("baseCost") as string),
    costPerArea: JSON.parse(formdata.get("costPerArea") as string),
    costPerColor: JSON.parse(formdata.get("costPerColor") as string),
    isActive: formdata.get("isActive") ? 1 : 0,
    notes: formdata.get("notes"),
  };

  const parseData = formHargaJenisSchema.safeParse(raw);

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid",
      error: parseData.error,
    });
  const { data } = parseData;
  try {
    const res = await prisma.sablonType.create({
      data: { ...data },
    });
    revalidatePath("/harga-jenis");
    return sendResponse({
      success: true,
      message: "Menambahkan data harga & jenis",
      data: res,
    });
  } catch (error) {

    return sendResponse({
      success: false,
      message: "Menambahkan data harga & jenis",
    });
  }
};

export const updateHargaJenis = async (id: string, formdata: FormData) => {
  const raw = {
    name: formdata.get("name"),
    description: formdata.get("description"),
    basePrice: JSON.parse(formdata.get("basePrice") as string),
    pricePerColor: JSON.parse(formdata.get("pricePerColor") as string),
    pricePerArea: JSON.parse(formdata.get("pricePerArea") as string),
    baseCost: JSON.parse(formdata.get("baseCost") as string),
    costPerArea: JSON.parse(formdata.get("costPerArea") as string),
    costPerColor: JSON.parse(formdata.get("costPerColor") as string),
    isActive: formdata.get("isActive") ? 1 : 0,
    notes: formdata.get("notes"),
  };

  const parseData = formHargaJenisSchema.safeParse(raw);
  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid",
      error: parseData.error,
    });
  try {
    const datanDb = await prisma.sablonType.findUnique({ where: { id } });
    if (!datanDb)
      return sendResponse({
        success: false,
        message: "Mendapatkan data harga & jenis",
      });
    const { data } = parseData;
    await prisma.sablonType.update({ data: { ...data }, where: { id } });
    revalidatePath("/harga-jenis");
    return sendResponse({
      success: true,
      message: "Mengedit data harga & jenis",
    });
  } catch (error) {

    return sendResponse({
      success: false,
      message: "Mengedit data harga & jenis",
    });
  }
};
export const deleteHargaJenis = async (
  id: string
): Promise<Response<SablonType>> => {
  try {
    const dataInDb = await prisma.sablonType.findUnique({ where: { id } });
    if (!dataInDb)
      return sendResponse({
        success: false,
        message: "Mendapatkan data harga & jenis",
      });
    await prisma.sablonType.delete({ where: { id } });
    revalidatePath("harga-jenis")
    return sendResponse({
      success: true,
      message: "Menghapus data harga & jenis",
    });
  } catch (error) {
    console.log({ error });

    return sendResponse({
      success: false,
      message: "Menghapus data harga & jenis",
    });
  }
};
