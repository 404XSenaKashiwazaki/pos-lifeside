"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "../actions";
import { GalleryVerticalEnd } from "lucide-react";
import { useSite } from "@/components/providers/Site-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Image from "next/image";

const Form = () => {
  const site = useSite();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const redirect = searchParams.get("redirect") || "/";
  return (
    <div className="flex min-h-screen mt-10 sm:mt-40 justify-center">
      <div className="w-full max-w-sm flex flex-col gap-5">
        <a className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            { site?.fileProofUrl ? <Image
              src={site?.fileProofUrl ?? ""}
              alt="sfasg"
              width={100}
              height={100}
              priority
              className="w-6 h-6 rounded-sm"
            /> : <GalleryVerticalEnd className="size-4" />}
          </div>
          {site?.name ?? process.env.NEXT_PUBLIC_APP_NAME}
        </a>
        {error === "AccessDenied" && (
          <Alert variant="destructive" className="text-left">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Akses Ditolak</AlertTitle>
            <AlertDescription>
              Email Anda tidak memiliki akses ke sistem ini.
            </AlertDescription>
          </Alert>
        )}

        {error === "OAuthAccountNotLinked" && (
          <Alert variant="destructive" className="text-left">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Akun Tidak Terhubung</AlertTitle>
            <AlertDescription>
              Email ini sudah terdaftar dengan metode login lain. Silakan
              gunakan metode login sebelumnya.
            </AlertDescription>
          </Alert>
        )}

        <Card className="w-full max-w-sm">
          <form action={login.bind(null, redirect)}>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Silahkan login menggunakan akun Google
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex-col gap-2 py-2 mt-5">
              <Button type="submit" variant="default" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Form;
