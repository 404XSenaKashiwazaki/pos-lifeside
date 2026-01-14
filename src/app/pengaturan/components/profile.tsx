"use client";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon, X } from "lucide-react";
import {
  IconAddressBook,
  IconEdit,
  IconMail,
  IconPencil,
  IconPhone,
  IconShieldExclamation,
  IconUserEdit,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/components/providers/Sheet-provider";
import FormPage from "./form";
import Site from "./site";

const ProfileCard = () => {
  const { data: session, update } = useSession();
  const { sheet } = useSheet();
  if (!session?.user) return null;

  const handleButtonEditClick = () => {
    sheet({
      title: (
        <span className="flex items-center gap-1 text-muted-foreground font-medium">
          <IconUserEdit className="h-4 w-4" />
          Form edit data profile
        </span>
      ),
      description: "form untuk edit data profile ",
      content: (
        <FormPage
          id={session.user.id ?? ""}
          phone={session.user.phone ?? undefined}
          email={session.user.email ?? ""}
          address={session.user.address ?? ""}
          imageUrl={session.user.imageUrl ?? ""}
          update={update}
          image={session.user.image ?? ""}
        />
      ),
      size: "sm:max-w-md",
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start gap-2">
      <Card className="w-full max-w-sm">
        <CardContent>
          <div className="w-20 h-20 rounded-full overflow-hidden mb-4">
            <Image
              src={
                session.user.imageUrl
                  ? session.user.imageUrl
                  : session.user.image || ""
              }
              alt={
                session.user.imageUrl
                  ? session.user.imageUrl
                  : session.user.image || "Profile photo"
              }
              width={100}
              height={100}
              priority
              className="rounded-full mb-4  w-full h-full max-w-20 max-h-20"
            />
          </div>


          <h2 className="text-md font-semibold mb-1">Informasi Akun</h2>

          <Badge
            variant="secondary"
            className="bg-blue-500 text-white dark:bg-blue-600 mt-1 mb-2 "
          >
            <BadgeCheckIcon />
            {session.user.role}
          </Badge>
          <Separator className="my-2 mb-5" />
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground">
                <IconPencil className="h-4 w-4" />
                Nama:
              </span>
              <span className="font-medium text-primary">
                {session.user.name ?? "-"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground">
                <IconMail className="h-4 w-4" />
                Email:
              </span>
              <span className="font-medium text-primary">
                {session.user.email ?? "-"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground">
                <IconPhone className="h-4 w-4" />
                Nomor hp:
              </span>
              <span className="font-medium text-primary">
                {session.user.phone ?? "-"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground">
                <IconAddressBook className="h-4 w-4" />
                Alamat:
              </span>
              <span className="font-medium text-primary">
                {session.user.address ?? "-"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm ">
              <span className="flex items-center gap-1 text-muted-foreground">
                <IconShieldExclamation className="h-4 w-4" />
                Level:
              </span>
              <span className="font-medium text-primary">
                {session.user.role ?? "-"}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant={"default"}
              onClick={handleButtonEditClick}
              size={"sm"}
            >
              <IconEdit />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
      {session.user.role?.toLowerCase() != "staff" ? (
        <>
          {" "}
          <Card className="w-full px-4 py-3">
            <Site />
          </Card>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ProfileCard;
