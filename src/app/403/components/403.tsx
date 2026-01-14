"use client";

import { useRouter } from "next/navigation";

export default function ForbiddenPage403() {
  const router = useRouter();

  return (
    <div className="flex h-screen items-start justify-center">
      <div className="text-center max-w-md mt-5 sm:mt-10">
        <h1 className="text-5xl font-bold text-red-600">403</h1>

        <h2 className="mt-4 text-xl font-semibold">Akses Ditolak</h2>

        <p className="mt-2 text-gray-500">
          Kamu tidak memiliki izin untuk mengakses halaman ini.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg bg-gray-200 px-5 py-2 text-sm font-medium hover:bg-gray-300"
          >
            Kembali
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
