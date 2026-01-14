import { NextResponse, NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/src/auth/config";

export const { auth } = NextAuth(authConfig);

export default async function middleware(request: NextRequest) {
  const currentUrl = request.nextUrl.pathname;

  const protectedRoute = [
    "/",
    "/dashboard",
    "/pengaturan",
    "/users",
    "/pembayaran",
    "/pemesanan",
    "/produksi",
    "/harga-jenis",
    "/laporan",
    "/cetak-pembayaran",
    "/cetak-pemesanan",
    "/metode-pembayaran",
    "/produk",
    "/pelanggan",
    "/ukuran-produk"
  ];

  const adminRoute = protectedRoute;
  const staffRoute = protectedRoute.filter(
    (e) => !["/users", "/metode-pembayaran"].includes(e)
  );
  const ownerRoute = protectedRoute.filter((e) => e !== "/users");

  const userAuth = await auth();
  const role = userAuth?.user?.role?.toLowerCase();

  if (!userAuth && protectedRoute.includes(currentUrl)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", currentUrl);
    return NextResponse.redirect(loginUrl);
  }


  if (userAuth && currentUrl === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (role) {
    const roleAccessMap: Record<string, string[]> = {
      admin: adminRoute,
      staff: staffRoute,
      manager: ownerRoute,
    };

    const allowedRoutes = roleAccessMap[role];

    if (
      protectedRoute.includes(currentUrl) &&
      !allowedRoutes.includes(currentUrl)
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
