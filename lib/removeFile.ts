import path from "path";
import fs from "fs/promises";

export async function removeFile(fileUrl: string) {
  if (!fileUrl) return;

  const realPath = path.join(process.cwd(), "public", fileUrl);

  try {
    await fs.unlink(realPath);
  } catch (err) {
    if (err instanceof Error) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
        throw err;
      }
    }
  }
}
