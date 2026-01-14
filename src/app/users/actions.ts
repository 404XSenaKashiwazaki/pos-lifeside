"use server";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { type Response } from "@/types/response";
import { formUserSchema } from "@/types/zod";
import { User, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const addUser = async (formdata: FormData): Promise<Response<User>> => {
  const parseData = formUserSchema.safeParse({
    name: formdata.get("name"),
    email: formdata.get("email"),
    phone: JSON.parse(formdata.get("phone") as string),
    address: formdata.get("address"),
    role: formdata.get("role"),
  });

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid",
      error: parseData.error,
    });
  const { data } = parseData;
  try {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        address: data.address,
        phone: BigInt(data.phone),
        image: "preview.jpg",
        imageUrl: "http://localhost:3000/preview.jpg",
        role: data.role as UserRole,
      },
    });
    revalidatePath("/users");
    return sendResponse({
      success: true,
      message: "Menambahkan data user",
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Menambahkan data user",
    });
  }
};

export const updateUser = async (
  id: string,
  formdata: FormData
): Promise<Response<User>> => {
  const parseData = formUserSchema.safeParse({
    name: formdata.get("name"),
    email: formdata.get("email"),
    phone: JSON.parse(formdata.get("phone") as string),
    address: formdata.get("address"),
    role: formdata.get("role"),
  });

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid",
      error: parseData.error,
    });
  try {
    const userInDb = await prisma.user.findUnique({ where: { id } });
    if (!userInDb)
      return sendResponse({
        success: false,
        message: "Mendapatkan data user",
      });
    const { data } = parseData;
    await prisma.user.update({
      data: {
        name: data.name,
        email: data.email,
        address: data.address,
        phone: BigInt(data.phone),
        role: data.role as UserRole,
      },
      where: { id: userInDb.id },
    });
    revalidatePath("/users");
    return sendResponse({
      success: true,
      message: "Mengupdate data user",
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Mengupdate data user",
    });
  }
};
export const deleteUser = async (id: string): Promise<Response<User>> => {
  try {
    const userInDb = await prisma.user.findUnique({ where: { id } });
    if (!userInDb)
      return sendResponse({
        success: false,
        message: "Mendapatkan data user",
      });
    await prisma.user.delete({ where: { id } });
    revalidatePath("/users");
    return sendResponse({
      success: true,
      message: "Menghapus data user",
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Menghapus data user",
    });
  }
};
