"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconShoppingCart,
  IconCreditCard,
  IconArchive,
  IconUsersGroup,
  IconPackage,
  IconResize,
  IconCreditCardFilled,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useSite } from "@/components/providers/Site-provider";
import Image from "next/image";
import defaultImg from "@/public/preview.jpg";

// ------------------------------
// NAV DATA
// ------------------------------
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      activeUrl: ["/dashboard", "/"],
    },
    {
      title: "Produk",
      url: "/produk",
      icon: IconPackage,
      activeUrl: ["/produk"],
    },
    {
      title: "Ukuran Produk",
      url: "/ukuran-produk",
      icon: IconResize,
      activeUrl: ["/ukuran-produk"],
    },
    {
      title: "Pemesanan",
      url: "/pemesanan",
      icon: IconShoppingCart,
      activeUrl: ["/pemesanan"],
    },
    {
      title: "Metode Pembayaran",
      url: "/metode-pembayaran",
      icon: IconCreditCardFilled,
      activeUrl: ["/metode-pembayaran"],
    },
    {
      title: "Pembayaran",
      url: "/pembayaran",
      icon: IconCreditCard,
      activeUrl: ["/pembayaran"],
    },
    {
      title: "Produksi",
      url: "/produksi",
      icon: IconFolder,
      activeUrl: ["/produksi"],
    },
    {
      title: "Pelanggan",
      url: "/pelanggan",
      icon: IconUsersGroup,
      activeUrl: ["/pelanggan"],
    },
    {
      title: "Harga & Jenis",
      url: "/harga-jenis",
      icon: IconArchive,
      activeUrl: ["/harga-jenis"],
    },
    {
      title: "Users",
      url: "/users",
      icon: IconUsers,
      activeUrl: ["/users"],
    },
    {
      title: "Laporan",
      url: "/laporan",
      icon: IconChartBar,
      activeUrl: ["/laporan", "/cetak-pemesanan", "/cetak-pembayaran"],
    },
    {
      title: "Pengaturan",
      url: "/pengaturan",
      icon: IconSettings,
      activeUrl: ["/pengaturan"],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const site = useSite();
  const pathname = usePathname() ?? "/";

  if (!session) return null;

  const role = session?.user?.role?.toLowerCase();

  const hiddenForStaff = ["/users", "/metode-pembayaran"];
  const hiddenForOwner = ["/users"];

  const filteredMenu = data.navMain.filter((item) => {
    if (role === "staff" && hiddenForStaff.includes(item.url)) return false;
    if (role === "owner" && hiddenForOwner.includes(item.url)) return false;
    return true; 
  });

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image
                  src={site?.fileProofUrl ?? defaultImg}
                  alt="Logo"
                  className="w-7 h-7 rounded-full"
                  width={100}
                  height={100}
                  priority
                />
                <span className="text-base font-semibold uppercase">
                  {site?.name}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Inject menu yang sudah difilter */}
        <NavMain items={filteredMenu} pathname={pathname} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={Object(session?.user)} />
      </SidebarFooter>
    </Sidebar>
  );
}
