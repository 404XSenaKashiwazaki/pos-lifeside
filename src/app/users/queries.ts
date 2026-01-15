"use server";

import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { Response } from "@/types/response";
import {  User } from "@prisma/client";

export const getUsers= async (): Promise<Response<User[]>> => {
  try {
    const res = await prisma.user.findMany({
       orderBy: {
        id: "desc"
      }
    });
    if (!res)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data user",
      });
    return sendResponse({
      success: true,
      message: "Berhasil mendapatkan data user",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data user",
    });
  }
};



export const getUsersById = async (id: string): Promise<Response<User>> => {
  if(!id) return sendResponse({
        success: false,
        message: "Gagal mendapatkan data user",
      });
  try {
    const res = await prisma.user.findUnique({ where: {id}});
    if (!res)
      return sendResponse({
        success: false,
        message: "Gagal mendapatkan data user",
      });
    return sendResponse({
      success: true,
      message: "Berhasil mendapatkan data user",
      data: res,
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Gagal mendapatkan data user",
    });
  }
};

