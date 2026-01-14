import {
  findDataPaymentByName,
  findDataPaymentByNo,
  findDataProductById,
} from "@/lib/findData";
import { OrderStatus, PaymentStatus, ProductionStatus } from "@prisma/client";
import * as z from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const formCustomerSchema = z.object({
  name: z.string().min(1, "Nama wajib di isi."),
  phone: z
    .string()
    .min(11, { message: "No hp di isi dan minimal 11 karakter" })
    .max(12, { message: "No hp maksimal 12 karakter." }),
  email: z.email({ error: "Email tidak valid." }).min(1, "Email wajib di isi."),
  address: z.string().min(1, { message: "Alamat wajib di isi." }),
  notes: z.string().optional(),
});

export const formPaymentMethodsSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama wajib di isi")
      .superRefine(async (name, ctx) => {
        const indDb = await findDataPaymentByName(name);
        if (indDb)
          ctx.addIssue({
            code: "custom",
            message: `Nama tidak boleh ada yang sama.`,
            // path: ["name"],
          });
      }),
    no: z
      .number()
      .optional()
      .superRefine(async (no, ctx) => {
        if (no) {
          const indDb = await findDataPaymentByNo(no);
          if (indDb)
            ctx.addIssue({
              code: "custom",
              message: `Nomor tidak boleh ada yang sama.`,
              // path: ["no"],
            });
        }
      }),
    description: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (
      val.name !== "cash" &&
      (val.no === undefined || val.no === null || val.no === 0)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Nomor wajib diisi jika nama bukan 'CASH'.",
        path: ["no"],
      });
    }
  });

export const formHargaJenisSchema = z.object({
  name: z.string().min(1, { message: "Nama wajib di isi." }),
  description: z.string().min(1, { message: "Deskripsi wajib di isi." }),
  basePrice: z
    .number()
    .min(1, "Harga dasar wajib di isi.")
    .max(99999999999, "Harga dasar 11 digit."),
  pricePerArea: z
    .number()
    .max(99999999999, "Harga per area 11 digit.")
    .optional(),
  pricePerColor: z
    .number()
    .max(99999999999, "Harga per warna 11 digit.")
    .optional(),
  baseCost: z
    .number()
    .min(1, "Modal dasar warna wajib di isi.")
    .max(99999999999, "Modal dasar maksimal 11 digit."),
  costPerArea: z
    .number()
    .max(99999999999, "Modal per area maksimal 11 digit.")
    .optional(),
  costPerColor: z
    .number()
    .max(99999999999, "Modal per warna maksimal 11 digit.")
    .optional(),
  notes: z.string().optional(),
  isAtive: z.boolean().optional(),
});

export const formOrderSchema = z
  .object({
    // tb order /tb order item/ tb paryment
    orderNumber: z.string().min(1, "Order number wajib di isi."),
    customerId: z.string().min(1, "Customer  wajib di isi."), //tb design/tb order
    handleById: z.string().min(1, "Yang mengerjakan wajib di isi."),
    createdAt: z
      .union([z.string(), z.date(), z.undefined()])
      .default(new Date())
      .optional(),
    product: z.string().min(1, "Produk/barang  wajib di isi."),
    color: z.string().min(1, "Warna wajib di isi."),
    unitPrice: z
      .number()
      .min(1, "Harga per unit wajib di isi.")
      .max(99999999999, "Harga per unit maksimal 11 digit."),
    quantity: z.number().min(1, "Jumlah wajib di isi.").optional(),
    paymentMethod: z.string().min(1, "Metode Pembayaran wajib di isi."),
    noPayment: z.number().optional(),
    totalAmount: z
      .number()
      .min(1, "Sub total wajib di isi.")
      .max(99999999999, "Sub total maksimal 11 digit."),
    notes: z.string().optional(),
    status: z.string().min(1, "Status pemesanan wajib di isi."),
    size: z.string().min(1, "Ukuran wajib di isi."),
    // tb design
    filename: z.union([z.instanceof(File), z.string()]).refine(
      (val) => {
        if (val instanceof File) {
          return val.size > 0 && val.size <= MAX_FILE_SIZE;
        }
        if (typeof val === "string") return val.trim().length > 0;
        return false;
      },
      {
        message: "Desain file wajib diisi.",
      }
    ),

    previewUrl: z.string().optional(),
    productionDue: z.union([z.string(), z.date()]),
    //
    name: z.string().min(1, "Nama pemesan file wajib di isi."),
    phone: z.string().min(1, "Nomor hp pemesan file wajib di isi."),
    address: z.string().min(1, "Alamat pemesan wajib di isi."),
    email: z
      .email({ message: "Email pemesan tidak valid" })
      .min(1, "Email pemesan wajib di isi."),

    //
    sablonTypeId: z.string().min(1, "Type sablon wajib di isi."),
    colorCount: z
      .number()
      .min(1, "Jumlah warna wajib di isi.")
      .max(99999999999, "Jumlah warna maksimal 11 digit."),
    printArea: z
      .number()
      .min(1, "Area sablon wajib di isi.")
      .max(99999999999, "Area sabblon maksimal 11 digit."),
    shippingFee: z
      .number()
      .min(1, "Biaya pengiriman wajib di isi.")
      .max(99999999999, "Biaya pengiriman maksimal 11 digit."),
    discountAmount: z
      .number()
      .max(99999999999, "Diskon maksimal 11 digit.")
      .optional(),
    printAreas: z.string().max(191).optional(),
  })
  .superRefine(async (val, ctx) => {
    if (val.product) {
      const product = await findDataProductById(val.product);
      if (product && val.quantity) {
        if (val.quantity >= product?.stok)
          ctx.addIssue({
            code: "custom",
            message: "Jumlah melebihi stok produk.",
            path: ["quantity"],
          });
      }
    }
  });

export const formPaymentSchema = z.object({
  orderId: z.string().min(1, "Pemesan dan produk pesanan wajib di isi."),
  amount: z
    .number()
    .min(1, "Sub total wajib di isi.")
    .max(99999999999, "Sub total maksimal 11 digit."),
  method: z.string().min(1, "Metode pembayaran wajib di isi."),
  status: z.string().min(1, "Status pembayaran wajib di isi."),
  type: z.string().min(1, "Type pembayaran wajib di isi."),
  reference: z.union([z.instanceof(File), z.string()]).refine(
    (val) => {
      if (val instanceof File) {
        return val.size > 0 && val.size <= MAX_FILE_SIZE;
      }

      if (typeof val === "string") {
        return val.trim().length > 0;
      }

      return false;
    },
    {
      message: "Bukti pembayaran wajib diisi dan maksimal 2MB.",
    }
  ),
  amountReturn: z
    .number()
    .max(99999999999, "Kembalian maksimal 11 digit.")
    .optional(),
  paidAt: z
    .union([z.string(), z.date(), z.undefined()])
    .default(new Date())
    .optional(),
  notes: z.string().optional(),
});

export const formProfileSchema = z.object({
  phone: z
    .number({ message: "No hp tidak valid" })
    .min(11, { message: "No hp di isi dan minimal 11 angka" })
    .superRefine((val: number, ctx) => {
      if (val.toString().length > 12)
        ctx.addIssue({
          code: "custom",
          message: "No hp maksimal 12 angka",
        });
    }),
  address: z.string().min(1, { message: "Alamat wajib di isi." }),
  // image: z.union([z.file(), z.string()]).optional(),
  image: z
    .union([z.instanceof(File), z.string(), z.null()])
    .optional()
    .transform((val) => {
      if (val === "" || val === null) return undefined;
      return val;
    })
    .refine(
      (val) => {
        if (val === undefined) return true;
        if (val instanceof File) {
          return val.size > 0 && val.size <= MAX_FILE_SIZE;
        }
        if (typeof val === "string") {
          return val.trim().length > 0;
        }
        return false;
      },
      {
        message: "File maksimal 2MB dan tidak boleh kosong.",
      }
    ),

  imageUrl: z.string().optional(),
});

export const formReportStatusOrderSchema = z
  .object({
    startDate: z.date({ message: "Tanggal mulai wajib diisi." }),
    endDate: z.date({ message: "Tanggal akhir wajib diisi." }),
    statusOrder: z.union([
      z.enum(Object.values(OrderStatus), {
        error: "Status pemesanan tidak valid.",
      }),
      z.string().min(1, "Status pemesanan wajib di isi."),
    ]),
  })

  .refine((data) => data.endDate >= data.startDate, {
    message: "Tanggal akhir tidak boleh sebelum tanggal mulai",
    path: ["endDate"],
  });

export const formReportStatusPaymentSchema = z
  .object({
    startDate: z.date({ message: "Tanggal mulai wajib diisi." }),
    endDate: z.date({ message: "Tanggal akhir wajib diisi." }),
    statusPayment: z.union([
      z.enum(Object.values(PaymentStatus), {
        error: "Status pembayaran tidak valid.",
      }),
      z.string().min(1, "Status pembayaran wajib di isi."),
    ]),
  })

  .refine((data) => data.endDate >= data.startDate, {
    message: "Tanggal akhir tidak boleh sebelum tanggal mulai",
    path: ["endDate"],
  });

export const formProductionSchema = z.object({
  orderItemId: z.string().min(1, "Order wajib di isi."),
  assignedToId: z.string().min(1, "Yang mengerjakan wajib di isi."),
  sablonTypeId: z.string().min(1, "Type sablon wajib di isi."),
  startDate: z
    .union([z.string(), z.date(), z.undefined()])
    .default(new Date())
    .optional(),
  endDate: z
    .union([z.string(), z.date(), z.undefined()])
    .default(new Date())
    .optional(),
  progress: z.string().min(1, "Progres pengerjaan"),

  status: z.union([
    z.enum(Object.values(ProductionStatus), {
      error: "Status produksi tidak valid.",
    }),
    z.string().min(1, "Status produksi wajib di isi."),
  ]),
  filename: z
    .union([z.instanceof(File), z.string(), z.null()])
    .optional()
    .transform((val) => {
      if (val === "" || val === null) return undefined;
      return val;
    })
    .refine(
      (val) => {
        if (val === undefined) return true;
        if (val instanceof File) {
          return val.size > 0 && val.size <= MAX_FILE_SIZE;
        }
        if (typeof val === "string") {
          return val.trim().length > 0;
        }
        return false;
      },
      {
        message: "File maksimal 2MB dan tidak boleh kosong.",
      }
    ),

  notes: z.string().optional(),
});

export const formSiteSchema = z.object({
  name: z
    .string()
    .min(1, "Nama aplikasi wajib di isi.")
    .max(20, "Nama aplikasi maksimal 20 karakter"),
  fileName: z
    .union([z.instanceof(File), z.string(), z.null()])
    .optional()
    .transform((val) => {
      if (val === "" || val === null) return undefined;
      return val;
    })
    .refine(
      (val) => {
        if (val === undefined) return true;
        if (val instanceof File) {
          return val.size > 0 && val.size <= MAX_FILE_SIZE;
        }
        if (typeof val === "string") {
          return val.trim().length > 0;
        }
        return false;
      },
      {
        message: "File maksimal 2MB dan tidak boleh kosong.",
      }
    ),
  phone: z
    .string()
    .min(11, { message: "Nama wajib di isi dan minimal 11 karakter" })
    .max(12, { message: "No hp maksimal 12 karakter." }),
  email: z
    .email({ error: "Email tidak valid." })
    .min(1, "Email wajib di isi.")
    .max(100, "Email maksimal 100 karakter"),
  address: z
    .string()
    .min(1, { message: "Alamat wajib di isi." })
    .max(255, "Alamat maksimal 255 karakter"),
});

export const formProductSchema = z.object({
  name: z
    .string()
    .min(1, "Nama  wajib di isi.")
    .max(191, "Nama  maksimal 191 karakter"),
  fileName: z
    .union([z.instanceof(File), z.string(), z.null()])
    .optional()
    .transform((val) => {
      if (val === "" || val === null) return undefined;
      return val;
    })
    .refine(
      (val) => {
        if (val === undefined) return true;
        if (val instanceof File) {
          return val.size > 0 && val.size <= MAX_FILE_SIZE;
        }
        if (typeof val === "string") {
          return val.trim().length > 0;
        }
        return false;
      },
      {
        message: "File maksimal 2MB dan tidak boleh kosong.",
      }
    ),

  purchaseCost: z
    .number()
    .min(1, "Harga pembelian wajib di isi.")
    .max(99999999999, "Harga pembelian maksimal 11 digit."),
  sellingPrice: z
    .number()
    .min(1, "Harga penjualan wajib di isi.")
    .max(99999999999, "Harga penjualan maksimal 11 digit."),
  color: z
    .string()
    .min(1, "Warna  wajib di isi.")
    .max(20, "Warna  maksimal 20 karakter"),
  stok: z
    .number()
    .min(1, "Stok  wajib di isi.")
    .max(99999999999, "Stok maksimal 11 digit."),
  size: z
    .string()
    .min(1, "Ukuran  wajib di isi.")
    .max(20, "Ukuran  maksimal 20 karakter"),
  notes: z.string().max(191, "Catatan maksimal 191 karakter.").optional(),
});

export const formSizeSchema = z.object({
  name: z
    .string()
    .min(1, "Nama  wajib di isi.")
    .max(20, "Nama  maksimal 20 karakter"),
  chest: z
    .number()
    .min(1, "Lebar dada wajib di isi.")
    .max(99999999999, "Lebar dada maksimal 11 digit."),
  length: z
    .number()
    .min(1, "Panjang badan wajib di isi.")
    .max(99999999999, "Panjang badan 11 digit."),
  sleeve: z
    .number()
    .min(1, "Panjang lengan wajib di isi.")
    .max(99999999999, "Panjang lengan 11 digit."),
  note: z.string().max(191, "Catatan maksimal 191 karakter.").optional(),
});

export const formUserSchema = z.object({
  name: z.string().min(1, "Nama wajib di isi."),
  phone: z
    .number({ message: "No hp tidak valid" })
    .superRefine((val: number, ctx) => {
      if (val.toString().length > 12)
        ctx.addIssue({
          code: "custom",
          message: "No hp maksimal 12 angka",
        });
      if (val.toString().length < 11)
        ctx.addIssue({
          code: "custom",
          message: "No hp di isi dan minimal 11 angka",
        });
    }),
  email: z.email({ error: "Email tidak valid." }).min(1, "Email wajib di isi."),
  address: z.string().min(1, { message: "Alamat wajib di isi." }),
  role: z.string().min(1, { message: "Role wajib di isi." }),
});
