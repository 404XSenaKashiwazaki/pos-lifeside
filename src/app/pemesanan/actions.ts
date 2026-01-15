"use server";
import { auth } from "@/auth";
import { calculateCostAndProfit } from "@/lib/calculateCostAndProfit";
import { createSKU } from "@/lib/createSku";
import { prisma } from "@/lib/prisma";
import { sendResponse } from "@/lib/response";
import { getFilePath, removeFile, uploadFile } from "@/lib/uploadFile";
import { type Response } from "@/types/response";
import { formOrderSchema } from "@/types/zod";
import { Order, OrderStatus } from "@prisma/client";
import { existsSync } from "fs";
import { revalidatePath } from "next/cache";

export const addOrder = async (
  formdata: FormData
): Promise<Response<Order>> => {
  const currentLogin = await auth();
  const raw = {
    name: formdata.get("name"),
    phone: formdata.get("phone"),
    email: formdata.get("email"),
    address: formdata.get("address"),
    notes: formdata.get("notes"),
    customerId: formdata.get("customerId"),
    product: formdata.get("product"),
    color: formdata.get("color"),
    filename: formdata.get("filename"),
    status: formdata.get("status"),
    createdAt: formdata.get("createdAt"),
    unitPrice: JSON.parse(formdata.get("unitPrice") as string),
    quantity: JSON.parse(formdata.get("quantity") as string),
    totalAmount: JSON.parse(formdata.get("totalAmount") as string),
    orderNumber: formdata.get("orderNumber"),
    size: formdata.get("size"),
    productionDue: formdata.get("productionDue"),
    handleById: formdata.get("handleById"),
    sablonTypeId: formdata.get("sablonTypeId"),
    colorCount: JSON.parse(formdata.get("colorCount") as string),
    printArea: JSON.parse(formdata.get("printArea") as string),
    shippingFee: JSON.parse(formdata.get("shippingFee") as string),
    discountAmount: JSON.parse(formdata.get("discountAmount") as string),
    noPayment: JSON.parse(formdata.get("noPayment") as string),
    paymentMethod: formdata.get("paymentMethod"),
    printAreas: formdata.get("printAreas"),
  };

  const parseData = await formOrderSchema.safeParseAsync(raw);
  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid",
      error: parseData.error,
    });

  const { data } = parseData;
  const sablonType = await prisma.sablonType.findUnique({
    where: {
      id: data.sablonTypeId,
    },
  });
  const product = await prisma.product.findUnique({
    where: { id: data.product },
  });
  const file = formdata.get("filename") as File | null;
  let fileName = "";
  let fileUrl = "";
  if (file) {
    const fileUpload = await uploadFile(file, "uploads");
    fileName = fileUpload.fileName;
    fileUrl = fileUpload.fileUrl;
  } else {
    fileName = process.env.PREVIEW_IMAGE as string;
    fileUrl = process.env.PREVIEW_IMAGE_URL as string;
  }

  const costAndProfit = calculateCostAndProfit({
    colorCount: data.colorCount,
    printArea: data.printArea,
    purchaseCost: product?.purchaseCost ?? 0,
    quantity: data.quantity ?? 1,
    sabBase: sablonType?.baseCost ?? 0,
    sabPricePerColor: sablonType?.pricePerColor ?? 0,
    totalAmount: data.totalAmount,
    unitPrice: data.unitPrice,
  });
const sablonPerUnit = costAndProfit.costTotal / (data.quantity ?? 1)
  try {
    const order = await prisma.order.create({
      data: {
        customerId: data.customerId,
        orderNumber: data.orderNumber,
        totalAmount: data.totalAmount,
        createdAt: data.createdAt,
        createdById: currentLogin?.user.id,
        notes: data.notes,
        status: (data.status as OrderStatus) || OrderStatus.PENDING,
        productionDue: data.productionDue,
        handledById: data.handleById,
        paymentMethod: data.paymentMethod,
        noPayment: data.noPayment,
        items: {
          create: {
            product: data.product,
            subtotal:(data.unitPrice + sablonPerUnit) * (data.quantity ?? 1),
            unitPrice: data.unitPrice,
            color: data.color,
            notes: data.notes,
            costPrice: costAndProfit.costPrice,
            costTotal: costAndProfit.costTotal,
            printAreas: data.printAreas,
            quantity: data.quantity,
            size: data.size,
            printArea: data.printArea,
            colorCount: data.colorCount,
            production: {
              create: {
                assignedToId: data.handleById,
                sablonTypeId: data.sablonTypeId,
                endDate: data.productionDue,
                startDate: data.createdAt,
              },
            },
          },
        },
        designs: {
          create: {
            filename: fileName,
            fileUrl: fileUrl,
            previewUrl: fileUrl,
            uploadedBy: currentLogin?.user.id,
          },
        },
      },
    });

    await prisma.product.update({
      data: {
        stok: {
          decrement: data.quantity,
        },
      },
      where: {
        id: data.product,
      },
    });

    // const orderItems = await prisma.orderItem.findMany({
    //   where: { orderId: order.id },
    // });

    // const orderSubtotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0);

    // const finalTotal =
    //   orderSubtotal + (data.shippingFee || 0) - (data.discountAmount || 0);

    const orderItems = await prisma.orderItem.findMany({
  where: { orderId: order.id },
});

const orderSubtotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0);

const finalTotal =
  orderSubtotal + (data.shippingFee || 0) - (data.discountAmount || 0);


    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        totalAmount: finalTotal,
        shippingFee: data.shippingFee || 0,
        discountAmount: data.discountAmount || 0,
      },
    });
    revalidatePath("/pemesanan");
    return sendResponse({
      success: true,
      message: "Menambahkan data pemesanan",
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
      message: "Menambahkan data pemesanan",
    });
  }
};

export const updateOrder = async (
  id: string,
  formdata: FormData
): Promise<Response<Order>> => {
  const currentLogin = await auth();
  const raw = {
    name: formdata.get("name"),
    phone: formdata.get("phone"),
    email: formdata.get("email"),
    address: formdata.get("address"),
    notes: formdata.get("notes"),
    customerId: formdata.get("customerId"),
    product: formdata.get("product"),
    color: formdata.get("color"),
    filename: formdata.get("filename"),
    status: formdata.get("status"),
    createdAt: formdata.get("createdAt"),
    unitPrice: JSON.parse(formdata.get("unitPrice") as string),
    quantity: JSON.parse(formdata.get("quantity") as string),
    totalAmount: JSON.parse(formdata.get("totalAmount") as string),
    orderNumber: formdata.get("orderNumber"),
    size: formdata.get("size"),
    productionDue: formdata.get("productionDue"),
    handleById: formdata.get("handleById"),
    sablonTypeId: formdata.get("sablonTypeId"),
    colorCount: JSON.parse(formdata.get("colorCount") as string),
    printArea: JSON.parse(formdata.get("printArea") as string),
    shippingFee: JSON.parse(formdata.get("shippingFee") as string),
    discountAmount: JSON.parse(formdata.get("discountAmount") as string),
    noPayment: JSON.parse(formdata.get("noPayment") as string),
    printAreas: formdata.get("printAreas"),
    paymentMethod: formdata.get("paymentMethod"),
  };

  const parseData = await formOrderSchema.safeParseAsync(raw);

  if (!parseData.success)
    return sendResponse({
      success: false,
      message: "Data tidak valid",
      error: parseData.error,
    });
  const { data } = parseData;
  const dataInDb = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          production: true,
          products: true,
        },
      },
      designs: true,
    },
  });

  if (!dataInDb)
    return sendResponse({
      success: false,
      message: "Mendapatkan data pemesanan",
    });

  const sablonType = await prisma.sablonType.findUnique({
    where: {
      id: data.sablonTypeId,
    },
  });
  const product = await prisma.product.findUnique({
    where: { id: data.product },
  });

  const file = formdata.get("filename") as File | null;
  let fileName = "";
  let fileUrl = "";

  const costAndProfit = calculateCostAndProfit({
    colorCount: data.colorCount,
    printArea: data.printArea,
    purchaseCost: product?.purchaseCost ?? 0,
    quantity: data.quantity ?? 1,
    sabBase: sablonType?.baseCost ?? 0,
    sabPricePerColor: sablonType?.pricePerColor ?? 0,
    totalAmount: data.totalAmount,
    unitPrice: data.unitPrice,
  });

 const printTotal =
  ((sablonType?.baseCost ?? 0) +
   (sablonType?.pricePerColor ?? 0) * data.colorCount) *
  (data.quantity ?? 1);
  const itemSubtotal =
  (data.unitPrice * (data.quantity ?? 1)) + printTotal;
  const orderSubtotal = itemSubtotal

  try {
    const difference = data.quantity ?? 1 - dataInDb.items[0].quantity;

    if (!file || typeof file === "string") {
      fileName = dataInDb.designs[0].filename;
      fileUrl = dataInDb.designs[0].fileUrl;
    } else {
      if (file instanceof File) {
        const filePath = getFilePath(dataInDb.designs[0].fileUrl);
        const fileUpload = await uploadFile(file, "uploads");
        fileName = fileUpload.fileName;
        fileUrl = fileUpload.fileUrl;
        if (
          dataInDb.designs[0].filename !==
            (process.env.PREVIEW_IMAGE as string) &&
          existsSync(filePath)
        ) {
          console.log("remove file");
          await removeFile(filePath);
        }
      }
    }
    if (difference > 0)
      await prisma.product.update({
        where: { id: data.product },
        data: {
          stok: { decrement: difference },
        },
      });

    if (difference < 0)
      await prisma.product.update({
        where: { id: data.product },
        data: {
          stok: { increment: Math.abs(difference) },
        },
      });



    await prisma.$transaction([
      prisma.order.update({
        data: {
          customerId: data.customerId,
          orderNumber: data.orderNumber,
          // totalAmount: data.totalAmount,
          createdAt: data.createdAt,
          createdById: currentLogin?.user.id,
          notes: data.notes,
          status: (data.status as OrderStatus) || OrderStatus.PENDING,
          productionDue: data.productionDue,
          handledById: data.handleById,
          paymentMethod: data.paymentMethod,
          noPayment: data.noPayment,
          designs: {
            update: {
              where: { id: dataInDb.designs[0].id },
              data: {
                filename: fileName,
                fileUrl: fileUrl,
                previewUrl: fileUrl,
                uploadedBy: currentLogin?.user.id,
              },
            },
          },
          items: {
            update: {
              where: { id: dataInDb.items[0].id },
              data: {
                product: data.product,
                subtotal: itemSubtotal,
                unitPrice: data.unitPrice,
                color: data.color,
                notes: data.notes,
                quantity: Number(data.quantity),
                size: data.size,
                printArea: data.printArea,
                colorCount: Number(data.colorCount),
                costPrice: costAndProfit.costPrice,
                costTotal: costAndProfit.costTotal,
                printAreas: data.printAreas,
                production: {
                  update: {
                    data: {
                      assignedToId: data.handleById,
                      sablonTypeId: data.sablonTypeId,
                      endDate: data.productionDue,
                      startDate: data.createdAt,
                    },
                    where: {
                      orderItemId: dataInDb.items[0].id,
                    },
                  },
                },
              },
            },
          },
        },
        where: { id },
      }),
    ]);

    // const orderSubtotal = dataInDb.items[0].subtotal;
    

    const finalTotal =
      orderSubtotal + (data.shippingFee || 0) - (data.discountAmount || 0);

    await prisma.order.update({
      where: {
        id: dataInDb.id,
      },
      data: {
        totalAmount: finalTotal,
        shippingFee: data.shippingFee || 0,
        discountAmount: data.discountAmount || 0,
      },
    });
    revalidatePath("/pemesanan");
    return sendResponse({
      success: true,
      message: "Mengupdate data pemesanan",
    });
  } catch (error) {
    const filePath = getFilePath(fileUrl);
    if (
      file &&
      (fileName !== (process.env.PREVIEW_IMAGE as string) ||
        dataInDb.designs[0].filename !==
          (process.env.PREVIEW_IMAGE as string)) &&
      existsSync(filePath)
    ) {
      await removeFile(filePath);
      console.log("remove file");
    }

    return sendResponse({
      success: false,
      message: "Mengupdate data pemesanan",
    });
  }
};

export const deleteOrder = async (id: string): Promise<Response<Order>> => {
  try {
    const dataInDb = await prisma.order.findUnique({
      where: { id },
      include: {
        designs: true,
        payments: true,
        items: {
          include: {
            production: true,
          },
        },
      },
    });

    if (!dataInDb) {
      return sendResponse({
        success: false,
        message: "Mendapatkan data pemesanan",
      });
    }

    if (dataInDb.status === "PENDING" || dataInDb.status === "CONFIRMED") {
      await prisma.product.update({
        where: { id: dataInDb.items[0].product },
        data: {
          stok: { increment: dataInDb.items[0].quantity },
        },
      });
    }

    const payments = dataInDb.payments ?? [];
    if (payments.length > 0) {
      for (const pay of payments) {
        if (pay.filename !== process.env.PREVIEW_IMAGE && pay.reference) {
          const paymentPath = getFilePath(pay.reference);
          if (existsSync(paymentPath)) {
            await removeFile(paymentPath);
            console.log("remove payment file");
          }
        }
      }
    }

    if (dataInDb.designs.length > 0) {
      const fileUrl = dataInDb.designs[0].fileUrl;
      const filePath = getFilePath(fileUrl);

      if (
        dataInDb.designs[0].filename !== process.env.PREVIEW_IMAGE &&
        existsSync(filePath)
      ) {
        await removeFile(filePath);
        console.log("remove design file");
      }
    }

    await prisma.order.delete({ where: { id } });

    revalidatePath("pemesanan");

    return sendResponse({
      success: true,
      message: "Menghapus data pemesanan",
    });
  } catch (error) {
    return sendResponse({
      success: false,
      message: "Menghapus data pemesanan",
    });
  }
};
