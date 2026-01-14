import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const siteData: Prisma.SiteCreateInput = {
  name: "POS",
  email: "sgsdgsgd",
  phone: "pos@gmail.com",
  address: "Jl.sf s",
  filename: "preview.jpg",
  fileProofUrl: "/preview.jpg",
};
const productData: Prisma.ProductCreateInput[] = [
  {
    name: "Kaos Polos Cotton Combed 30s",
    sku: "CC30S-BLK-M",
    color: "Black",
    stok: 1,
    fileName: "preview.jpg",
    fileUrl: "/preview.jpg",
    size: "M",
    purchaseCost: 28000,
    sellingPrice: 40000,
    notes: "Kaos basic untuk sablon, bahan combed 30s",
  },
  {
    name: "Kaos Polos Cotton Combed 30s",
    sku: "CC30S-BLK-L",
    color: "Black",
    stok: 1,
    fileName: "preview.jpg",
    fileUrl: "/preview.jpg",
    size: "L",
    purchaseCost: 29000,
    sellingPrice: 41000,
    notes: "Ukuran L sedikit lebih mahal",
  },
  {
    name: "Kaos Polos Cotton Combed 30s",
    sku: "CC30S-WHT-M",
    color: "White",
    stok: 1,
    fileName: "preview.jpg",
    fileUrl: "/preview.jpg",
    size: "M",
    purchaseCost: 26000,
    sellingPrice: 38000,
    notes: "Warna putih biasanya lebih murah",
  },
  {
    name: "Kaos Polos Cotton Combed 30s",
    sku: "CC30S-NVY-M",
    color: "Navy",
    stok: 1,
    fileName: "preview.jpg",
    fileUrl: "/preview.jpg",
    size: "M",
    purchaseCost: 28000,
    sellingPrice: 40000,
    notes: "Navy termasuk warna favorit",
  },
  {
    name: "Kaos Polos Cotton Combed 24s",
    sku: "CC24S-GRY-M",
    color: "Grey",
    stok: 1,
    fileName: "preview.jpg",
    fileUrl: "/preview.jpg",
    size: "M",
    purchaseCost: 30000,
    sellingPrice: 42000,
    notes: "Bahan lebih tebal dari 30s",
  },
  {
    name: "Kaos Polos Cotton Combed 24s",
    sku: "CC24S-GRY-L",
    color: "Grey",
    stok: 1,
    fileName: "preview.jpg",
    fileUrl: "/preview.jpg",
    size: "L",
    purchaseCost: 31000,
    sellingPrice: 43000,
    notes: "Kualitas premium",
  },
  {
    name: "Kaos Polos Combat 20s",
    sku: "CMB20S-RD-M",
    color: "Red",
    stok: 1,
    fileName: "preview.jpg",
    fileUrl: "/preview.jpg",
    size: "M",
    purchaseCost: 25000,
    sellingPrice: 38000,
    notes: "Bahan lebih tebal dan awet",
  },
  {
    name: "Kaos Polos Raglan 3/4",
    sku: "RGL-RED-WHT-M",
    color: "Red/White",
    stok: 1,
    fileName: "preview.jpg",
    fileUrl: "/preview.jpg",
    size: "M",
    purchaseCost: 35000,
    sellingPrice: 50000,
    notes: "Model raglan untuk custom jersey",
  },
  {
    name: "Kaos Polos Oversize Streetwear 24s",
    sku: "OVS24S-BLK-XL",
    color: "Black",
    stok: 1,
    fileName: "preview.jpg",
    fileUrl: "/preview.jpg",
    size: "XL",
    purchaseCost: 38000,
    sellingPrice: 55000,
    notes: "Tren oversize premium",
  },
];

const sizeData: Prisma.SizeCreateInput[] = [
  { name: "S", chest: 46, length: 66, sleeve: 19 },
  { name: "M", chest: 50, length: 70, sleeve: 20 },
  { name: "L", chest: 54, length: 72, sleeve: 21 },
  { name: "XL", chest: 57, length: 74, sleeve: 22 },
  { name: "XXL", chest: 60, length: 76, sleeve: 23 },
];

const sablonTypeData: Prisma.SablonTypeCreateInput[] = [
  {
    name: "Plastisol",
    description:
      "Sablon minyak dengan hasil pekat, tahan lama, dan warna solid.",
    basePrice: 30000,
    pricePerColor: 5000,
    pricePerArea: 2000,
    baseCost: 12000,
    costPerColor: 3000,
    costPerArea: 1000,
    notes: "Wajib curing menggunakan heatpress atau conveyor.",
    isActive: true,
  },
  {
    name: "Rubber",
    description: "Sablon berbasis air, elastis, halus, dan menutup serat kain.",
    basePrice: 25000,
    pricePerColor: 4000,
    pricePerArea: 1500,
    baseCost: 9000,
    costPerColor: 2500,
    costPerArea: 800,
    notes: "Paling sering dipakai untuk kaos cotton combed.",
    isActive: true,
  },
  {
    name: "DTF (Direct Transfer Film)",
    description: "Full color, detail tinggi, cetak digital transfer.",
    basePrice: 35000,
    pricePerColor: 0,
    pricePerArea: 3000,
    baseCost: 15000,
    costPerColor: 0,
    costPerArea: 1500,
    notes: "Harga tergantung luas desain (per cm²).",
    isActive: true,
  },
  {
    name: "Polyflex",
    description: "Cutting vinyl dengan warna solid dan tampilan rapi.",
    basePrice: 30000,
    pricePerColor: 0,
    pricePerArea: 2500,
    baseCost: 11000,
    costPerColor: 0,
    costPerArea: 1200,
    notes: "Tidak cocok untuk desain kecil dan rapat.",
    isActive: true,
  },
  {
    name: "Sublim",
    description: "Sablon sublimasi untuk bahan polyester dengan warna cerah.",
    basePrice: 20000,
    pricePerColor: 0,
    pricePerArea: 1000,
    baseCost: 7000,
    costPerColor: 0,
    costPerArea: 600,
    notes: "Tidak bisa untuk bahan cotton.",
    isActive: true,
  },
  {
    name: "Embroidery (Bordir)",
    description: "Tekstur benang, sangat kuat dan premium.",
    basePrice: 50000,
    pricePerColor: 0,
    pricePerArea: 5000,
    baseCost: 30000,
    costPerColor: 0,
    costPerArea: 2500,
    notes: "HPP tergantung jumlah stitch.",
    isActive: true,
  },
  {
    name: "Discharge",
    description: "Melepaskan warna dasar kain, menghasilkan feel sangat halus.",
    basePrice: 35000,
    pricePerColor: 6000,
    pricePerArea: 2000,
    baseCost: 16000,
    costPerColor: 3500,
    costPerArea: 900,
    notes: "Tidak semua warna kain bisa discharge.",
    isActive: true,
  },
];

const userData: Prisma.UserCreateInput = {
  name: "Admin",
  email: "ag45agag@gmail.com",
};
const customerDarta: Prisma.CustomerCreateInput[] = [
  {
    name: "afasgfag",
    address: "Afasgasg",
    email: "afasfgas@gmail.com",
  },
];

const main = async () => {
  await prisma.site.create({ data: siteData });
  await prisma.size.createMany({ data: sizeData });
  await prisma.product.createMany({ data: productData });
  await prisma.sablonType.createMany({ data: sablonTypeData });
  // await prisma.user.create({ data: userData });
  await prisma.customer.createMany({
    data: customerDarta,
  });
  console.log("seed");
};

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
