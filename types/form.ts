import { Customer, Product, SablonType, Size, User } from "@prisma/client";
import { ColumnOrderTypeDefProps } from "./datatable";

export type FormCustomerValue = Partial<
  Omit<Customer, "createdAt" | "updatedAt">
>;

export type FormHargaJenisValue = Partial<
  Omit<SablonType, "createdAt" | "updatedAt">
>;


export type FormProdukValue = Partial<
  Omit<Product, "createdAt" | "updatedAt">
>;

export type FormSizeValue = Partial<
  Omit<Size, "createdAt" | "updatedAt">
>;

export type FormUserValue = Partial<
  Omit<User, "createdAt" | "updatedAt">
>;