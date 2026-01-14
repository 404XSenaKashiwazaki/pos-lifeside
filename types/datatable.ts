import {
  Customer,
  Order,
  OrderItem,
  PaymentMethods,
  Prisma,
  Product,
  SablonType,
  Size,
  User,
} from "@prisma/client";

export type ColumnPelangganDefProps = Omit<Customer, "updatedAt">;

export type ColumnUserDefProps = Omit<User, "updatedAt" | "password">;
export type ColumnPaymentMethodsDefProps = Omit<
  PaymentMethods,
  "updatedAt" | "password"
>;

export type ColumnProductsDefProps = Product;

export type ColumnSizesDefProps = Size;
export type ColumnSablonTypeDefProps = Omit<SablonType, "updatedAt">;

export type ColumnOrderTypeDefProps = Omit<
  Prisma.OrderGetPayload<{
    include: {
      customer: true;
      items: {
        include: {
          production: true;
          products: true;
        };
      };
      designs: true;
    };
  }>,
  "updatedAt"
>;

export type PrintOrders = Prisma.OrderGetPayload<{
  include: {
    customer: true;
    payments: true;
    items: {
      include: {
        products: true;
        production: {
          include: { sablonType: true };
        };
      };
    };
    designs: true;
  };
}>;

export type ColumnPaymentTypeDefProps = Omit<
  Prisma.PaymentGetPayload<{
    include: {
      method: true;

      order: {
        include: {
          designs: true;
          customer: true;
          items: {
            include: {
              products: true;
              production: {
                include: {
                  sablonType: true;
                };
              };
            };
          };
        };
      };
    };
  }>,
  "updatedAt"
>;

export type ColumnProductionTypeDefProps = Omit<
  Prisma.ProductionGetPayload<{
    include: {
      orderItem: {
        include: {
          products: true;
          order: {
            include: {
              designs: true;
            };
          };
        };
      };
      assignedTo: true;
      sablonType: true;
    };
  }>,
  "updatedAt"
>;
