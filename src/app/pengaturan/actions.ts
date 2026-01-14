"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { getFilePath, removeFile, uploadFile } from "@/lib/uploadFile";
import { Response } from "@/types/response";
import { formProfileSchema, formSiteSchema } from "@/types/zod";
import { Site, User } from "@prisma/client";
import { existsSync } from "fs";
import { revalidatePath } from "next/cache";

export const storeSite = async (
  formdata: FormData
): Promise<Response<Site>> => {
  const raw = {
    name: formdata.get("name"),
    filename: formdata.get("filename"),
    phone: formdata.get("phone"),
    address: formdata.get("address"),
    email: formdata.get("email"),
  };

  const parseData = formSiteSchema.safeParse(raw);
  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid",
      error: parseData.error,
    });
  const { data } = parseData;
  const file = formdata.get("filename") as File | null;
  let fileName = "";
  let fileUrl = "";
  const dataInDb = await prisma.site.findFirst();
  if (!file || typeof file === "string") {
    fileName = dataInDb?.filename ?? (process.env.PREVIEW_IMAGE as string);
    fileUrl =
      dataInDb?.fileProofUrl ??
      String(dataInDb?.filename) ??
      (process.env.PREVIEW_IMAGE_URL as string);
  } else {
    if (file instanceof File) {
      const filePath = getFilePath(dataInDb?.fileProofUrl ?? "");
      const fileUpload = await uploadFile(file, "site");
      fileName = fileUpload.fileName;
      fileUrl = fileUpload.fileUrl;

      if (
        dataInDb?.filename !== (process.env.PREVIEW_IMAGE as string) &&
        existsSync(filePath)
      ) {
        console.log("remove file");
        await removeFile(filePath);
      }
    } else {
      fileName = dataInDb?.filename ?? (process.env.PREVIEW_IMAGE as string);
      // fileUrl =
      //   dataInDb?.fileProofUrl ?? data.filename
      // ? (process.env.PREVIEW_IMAGE_URL as string)
      //     : (process.env.PREVIEW_IMAGE_URL as string);
      fileUrl =
        dataInDb?.fileProofUrl ??
        String(dataInDb?.filename) ??
        (process.env.PREVIEW_IMAGE_URL as string);
    }
  }
  try {
    const res = dataInDb
      ? await prisma.site.update({
          data: {
            name: data.name,
            address: data.address,
            email: data.email,
            phone: data.phone,
            filename: fileName,
            fileProofUrl: fileUrl,
          },
          where: { id: dataInDb.id },
        })
      : await prisma.site.create({
          data: { name: data.name, filename: fileName, fileProofUrl: fileUrl },
        });
    revalidatePath("/pengaturan");
    return sendResponse({
      success: true,
      message: "Mengupdate data pengaturan situs",
      data: res,
    });
  } catch (error) {
    const filePath = getFilePath(fileUrl);
    if (
      file &&
      (fileName !== (process.env.PREVIEW_IMAGE as string) ||
        dataInDb?.filename !== (process.env.PREVIEW_IMAGE as string)) &&
      existsSync(filePath)
    ) {
      await removeFile(filePath);
      console.log("remove file");
    }
    
    return sendResponse({
      success: false,
      message: "Mengupdate data pengaturan situs",
    });
  }
};

export const updateProfile = async (
  id: string,
  formdata: FormData
): Promise<Response<User>> => {


  const raw = {
    phone: JSON.parse(formdata.get("phone") as string),
    address: formdata.get("address"),
    image: formdata.get("image"),
    imageUrl: formdata.get("imageUrl"),
  };

  const parseData = formProfileSchema.safeParse(raw);
 
  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid.",
      error: parseData.error,
    });

  const { data } = parseData;
  const file = formdata.get("image") as File | null;
  let fileName = "";
  let fileUrl = "";
  const dataInDb = await prisma.user.findUnique({ where: { id } });
  if (!dataInDb)
    return sendResponse({
      success: false,
      message: "Mendapatkan data pengaturan.",
    });

  if (!file || typeof file === "string") {
    fileName = dataInDb?.image ?? (process.env.PREVIEW_IMAGE as string);
    fileUrl =
      dataInDb.imageUrl ??
      dataInDb.image ??
      (process.env.PREVIEW_IMAGE_URL as string);
  } else {
    if (file instanceof File) {
      const filePath = getFilePath(dataInDb.imageUrl ?? "");
      const fileUpload = await uploadFile(file, "profiles");
      fileName = fileUpload.fileName;
      fileUrl = fileUpload.fileUrl;

      if (
        dataInDb.image !== (process.env.PREVIEW_IMAGE as string) &&
        existsSync(filePath)
      ) {
        console.log("remove file");
        await removeFile(filePath);
      }
    } else {
      fileName = dataInDb.image ?? (process.env.PREVIEW_IMAGE as string);
      fileUrl =
        dataInDb.imageUrl ??
        dataInDb.image ??
        (process.env.PREVIEW_IMAGE_URL as string);
    }
  }

  try {
    

    const res = await prisma.user.update({
      data: {
        image: fileName,
        imageUrl: fileUrl,
        phone: data.phone,
        address: data.address,
      },
      where: { id },
    });
    revalidatePath("/pengaturan");
    return sendResponse({
      success: true,
      message: "Mengupdate data pengaturan",
      data: res,
    });
  } catch (error) {


    const filePath = getFilePath(fileUrl);
    if (
      file &&
      (fileName !== (process.env.PREVIEW_IMAGE as string) ||
        dataInDb.image !== (process.env.PREVIEW_IMAGE as string)) &&
      existsSync(filePath)
    ) {
      await removeFile(filePath);
      console.log("remove file");
    }
    return sendResponse({
      success: false,
      message: "Mengupdate data pengaturan",
    });
  }
};
